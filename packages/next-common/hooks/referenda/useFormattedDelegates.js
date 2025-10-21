import { usePageProps } from "next-common/context/page";
import {
  useDvReferendaCount,
  useFilteredDvVotes,
} from "next-common/context/referenda/dv";
import { useMemo } from "react";

export default function useFormattedDelegates() {
  const count = useDvReferendaCount();
  const votes = useFilteredDvVotes();
  const { cohort } = usePageProps();

  return useMemo(() => {
    return (cohort?.delegates || [])
      .map((delegate) => {
        const userVotes = votes.filter(
          (vote) => vote.account === delegate.address,
        );
        const voteCount = userVotes.length;

        return {
          ...delegate,
          userVotes: userVotes,
          voteCount,
          participation: voteCount / count,
        };
      })
      .sort((a, b) => b.participation - a.participation);
  }, [votes, cohort?.delegates, count]);
}
