import { useEffect, useState } from "react";
import { Conviction, isAye } from "../../utils/referendumCommon";
import useApi from "next-common/utils/hooks/useApi";

export default function useSubMyReferendaVote(
  trackId,
  referendumIndex,
  address,
) {
  const api = useApi();
  const [vote, setVote] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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
          setIsLoading(false);
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
  }, [api, trackId, referendumIndex, address]);

  return {
    vote,
    isLoading,
  };
}
