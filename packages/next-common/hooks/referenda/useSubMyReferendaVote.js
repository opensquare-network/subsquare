import { useEffect, useState } from "react";
import useIsMounted from "../../utils/hooks/useIsMounted";
import { Conviction, isAye } from "../../utils/referendumCommon";
import useReferendumVotingFinishHeight from "../../context/post/referenda/useReferendumVotingFinishHeight";
import useBlockApi from "../../utils/hooks/useBlockApi";

export default function useSubMyReferendaVote(
  trackId,
  referendumIndex,
  address,
) {
  const finishedHeight = useReferendumVotingFinishHeight();
  const api = useBlockApi(finishedHeight);
  const [vote, setVote] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const isMounted = useIsMounted();

  useEffect(() => {
    if (!api || !address || !api.query.convictionVoting) {
      return;
    }

    let unsub;
    setIsLoading(true);
    api.query.convictionVoting
      .votingFor(address, trackId, (voting) => {
        const jsonVoting = voting?.toJSON();
        if (!jsonVoting) {
          return null;
        }

        // For the direct vote, just return the vote.
        if (jsonVoting.casting) {
          const vote = (jsonVoting.casting.votes || []).find(
            (vote) => vote[0] === referendumIndex,
          )?.[1];

          setVote({
            ...vote,
            delegations: jsonVoting.casting.delegations,
          });
        }

        if (!jsonVoting.delegating) {
          return;
        }

        // If the address has delegated to other.
        // Then, look into the votes of the delegating target address.
        const { target, conviction } = jsonVoting.delegating;
        api.query.convictionVoting
          .votingFor(target, trackId)
          .then((proxyVoting) => {
            const jsonProxyVoting = proxyVoting?.toJSON();
            const vote = (jsonProxyVoting?.casting?.votes || []).find(
              (vote) => vote[0] === referendumIndex,
            )?.[1];

            if (!vote?.standard) {
              return;
            }

            // If the delegating target address has standard vote on this referendum,
            // means this address has voted on this referendum.
            const aye = isAye(vote.standard.vote);
            setVote({
              delegating: {
                ...jsonVoting.delegating,
                conviction: Conviction[conviction],
                voted: true,
                aye,
              },
            });
          });
      })
      .then((result) => {
        unsub = result;
      })
      .finally(() => {
        if (isMounted.current) {
          setIsLoading(false);
        }
      });

    return () => {
      if (unsub) {
        unsub();
      }
    };
  }, [api, trackId, referendumIndex, address, isMounted]);

  return {
    vote,
    isLoading,
  };
}
