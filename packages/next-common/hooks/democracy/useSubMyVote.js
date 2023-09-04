import useRealAddress from "../../utils/hooks/useRealAddress";
import useIsMounted from "../../utils/hooks/useIsMounted";
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

  if (!vote?.standard) {
    return null;
  }

  const aye = isAye(vote.standard.vote);
  return {
    delegating: {
      ...delegating,
      conviction: Conviction[conviction],
      voted: true,
      aye,
    },
  };
}

export default function useSubMyDemocracyVote() {
  const realAddress = useRealAddress();
  const isMounted = useIsMounted();
  const api = useApi();
  const { referendumIndex } = useOnchainData();

  const [vote, setVote] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!api || !realAddress || !api.query.democracy) {
      return;
    }

    let unsub;
    setIsLoading(true);
    api.query.democracy
      .votingOf(realAddress, (voting) => {
        const jsonVoting = voting?.toJSON();
        if (!jsonVoting) {
          return;
        }

        if (jsonVoting.direct) {
          const vote = (jsonVoting.direct.votes || []).find(
            (vote) => vote[0] === referendumIndex,
          )?.[1];

          if (isMounted.current) {
            setVote({
              ...vote,
              delegations: jsonVoting.direct.delegations,
            });
          }
        } else if (jsonVoting.delegating) {
          // If the address has delegated to other.
          // Then, look into the votes of the delegating target address.
          queryVotingByDelegation(
            api,
            referendumIndex,
            jsonVoting.delegating,
          ).then((delegatingVote) => {
            if (isMounted.current) {
              setVote(delegatingVote);
            }
          });
        }

        if (isMounted.current) {
          setIsLoading(false);
        }
      })
      .then((result) => {
        unsub = result;
      });

    return () => {
      if (unsub) {
        unsub();
      }
    };
  }, [api, isMounted, realAddress, referendumIndex]);

  return {
    vote,
    isLoading,
  };
}
