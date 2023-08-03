import { myVotesTriggerSelector } from "next-common/store/reducers/myVotesSlice";
import useApi from "next-common/utils/hooks/useApi";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function useAccountDemocracyVotes(address) {
  const api = useApi();
  const [isLoading, setIsLoading] = useState(false);
  const [votes, setVotes] = useState();
  const trigger = useSelector(myVotesTriggerSelector);

  useEffect(() => {
    if (!api || !api.query.democracy || !address) {
      setIsLoading(false);
      if (!address) {
        setVotes([]);
      }
      return;
    }

    setIsLoading(true);
    api.query.democracy
      .votingOf(address)
      .then((voting) => {
        const votes = [];
        if (voting.isDirect) {
          const direct = voting.asDirect;
          for (const vote of direct.votes) {
            const referendumIndex = vote[0].toNumber();
            const accountVote = vote[1];
            votes.push({ referendumIndex, vote: accountVote });
          }
        }
        setVotes(votes);
      })
      .finally(() => setIsLoading(false));
  }, [api, address, trigger]);

  return {
    isLoading,
    votes,
  };
}
