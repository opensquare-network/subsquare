import { useEffect, useState } from "react";
import { Conviction, isAye } from "../../utils/referendumCommon";
import { useContextApi } from "next-common/context/api";

export async function getReferendaDirectVote(
  api,
  address,
  trackId,
  referendumIndex,
) {
  const voting = await api.query.convictionVoting.votingFor(address, trackId);
  const jsonVoting = voting?.toJSON();
  if (!jsonVoting) {
    return;
  }

  const casting = jsonVoting.casting;
  if (!casting) {
    return;
  }

  const vote = (casting.votes || []).find(
    (vote) => vote[0] === referendumIndex,
  )?.[1];
  const delegations = casting.delegations.votes;

  return {
    vote,
    delegations,
  };
}

export default function useSubAddressReferendaVote(
  trackId,
  referendumIndex,
  address,
) {
  const api = useContextApi();
  const [vote, setVote] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

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
          setIsLoading(false);
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
          setIsLoaded(true);
        }

        if (!jsonVoting.delegating) {
          setIsLoading(false);
          return;
        }

        // If the address has delegated to others.
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
              setVote({
                delegating: {
                  ...jsonVoting.delegating,
                  conviction: Conviction[conviction],
                },
              });
              setIsLoading(false);
              setIsLoaded(true);
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
  }, [api, trackId, referendumIndex, address]);

  return {
    vote,
    isLoading,
    isLoaded,
  };
}
