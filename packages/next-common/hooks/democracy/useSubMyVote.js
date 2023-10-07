import { useEffect, useState } from "react";
import { useOnchainData } from "../../context/post";
import { Conviction, isAye } from "../../utils/referendumCommon";
import useApi from "next-common/utils/hooks/useApi";

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

export default function useSubMyDemocracyVote(address) {
  const api = useApi();
  const { referendumIndex } = useOnchainData();

  const [vote, setVote] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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
  };
}
