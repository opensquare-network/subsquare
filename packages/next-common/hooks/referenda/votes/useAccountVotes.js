import { useEffect, useState } from "react";
import useApi from "next-common/utils/hooks/useApi";

export default function useAccountVotes(address) {
  const api = useApi();
  const [isLoading, setIsLoading] = useState(false);
  const [votes, setVotes] = useState();

  useEffect(() => {
    console.log(api, address);
    if (!api || !api.query.convictionVoting || !address) {
      setIsLoading(false);
      if (!address) {
        setVotes([]);
      }
      return;
    }

    console.log("fetch votes");

    setIsLoading(true);
    api.query.convictionVoting.votingFor
      .entries(address)
      .then((entries) => {
        const votes = [];
        for (const [storageKey, votingOf] of entries) {
          const trackId = storageKey.args[1].toNumber();
          if (votingOf.isDelegating) {
            continue;
          }
          const casting = votingOf.asCasting;
          for (const vote of casting.votes) {
            const referendumIndex = vote[0].toNumber();
            const accountVote = vote[1];
            votes.push({ trackId, referendumIndex, vote: accountVote });
          }
        }

        setVotes(votes);
      })
      .finally(() => setIsLoading(false));
  }, [api, address]); // todo: we many need a trigger as another dependency to update votes

  return {
    isLoading,
    votes,
  };
}
