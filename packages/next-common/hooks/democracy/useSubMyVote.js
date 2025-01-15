import { useEffect, useState } from "react";
import { useOnchainData } from "../../context/post";
import { Conviction, isAye } from "../../utils/referendumCommon";
import { useContextApi } from "next-common/context/api";

async function queryVotingByDelegation(api, referendumIndex, delegating = {}) {
  const { target, conviction } = delegating;
  const proxyVoting = await api.query.democracy?.votingOf(target);
  const jsonProxyVoting = proxyVoting?.toJSON();

  const vote = (jsonProxyVoting?.direct?.votes || []).find(
    (vote) => vote[0] === referendumIndex,
  )?.[1];

  const common = {
    ...delegating,
    conviction: Conviction[conviction],
  };
  if (!vote?.standard) {
    return { delegating: common };
  }

  const aye = isAye(vote.standard.vote);
  return {
    delegating: {
      ...common,
      voted: true,
      aye,
    },
  };
}

export async function getDemocracyDirectVote(api, address, referendumIndex) {
  const voting = await api.query.democracy.votingOf(address);
  const jsonVoting = voting?.toJSON();
  if (!jsonVoting) {
    return;
  }

  const direct = jsonVoting.direct;

  if (!direct) {
    return;
  }
  const vote = (direct.votes || []).find(
    (vote) => vote[0] === referendumIndex,
  )?.[1];

  const delegations = direct.delegations.votes;

  return {
    vote,
    delegations,
  };
}

export default function useSubMyDemocracyVote(address) {
  const api = useContextApi();
  const { referendumIndex } = useOnchainData();

  const [vote, setVote] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!api || !address || !api.query.democracy) {
      return;
    }

    let unsub;
    setIsLoading(true);
    api.query.democracy
      .votingOf(address, (voting) => {
        const jsonVoting = voting?.toJSON();
        if (!jsonVoting) {
          setIsLoading(false);
          return;
        }

        if (jsonVoting.direct) {
          const vote = (jsonVoting.direct.votes || []).find(
            (vote) => vote[0] === referendumIndex,
          )?.[1];

          setVote({
            ...vote,
            delegations: jsonVoting.direct.delegations,
          });
          setIsLoaded(true);
        }

        if (!jsonVoting.delegating) {
          setIsLoading(false);
          return;
        }

        // If the address has delegated to others.
        // Then, look into the votes of the delegating target address.
        queryVotingByDelegation(
          api,
          referendumIndex,
          jsonVoting.delegating,
        ).then((delegatingVote) => {
          setVote(delegatingVote);
          setIsLoading(false);
          setIsLoaded(true);
        });
      })
      .then((result) => {
        unsub = result;
      });

    return () => {
      if (unsub) {
        unsub();
      }
    };
  }, [api, address, referendumIndex]);

  return {
    vote,
    isLoading,
    isLoaded,
  };
}
