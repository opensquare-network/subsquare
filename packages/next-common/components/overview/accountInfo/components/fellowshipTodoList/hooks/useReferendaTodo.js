import { useMemo } from "react";
import { useActiveReferendaContext } from "next-common/context/activeReferenda";
import useMyFellowshipReferendaVotes from "next-common/hooks/fellowship/useMyFellowshipReferendaVotes";
import { useRankedCollectivePallet } from "next-common/context/collectives/collectives";
import { getMinRankOfClass } from "next-common/context/post/fellowship/useMaxVoters";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import useSubCollectiveRank from "next-common/hooks/collectives/useSubCollectiveRank";

export default function useReferendaTodo(trigger) {
  const { activeReferenda, isLoading: isLoadingActiveReferenda } =
    useActiveReferendaContext();

  const collectivePallet = useRankedCollectivePallet();
  const address = useRealAddress();
  const { rank: myRank, loading: isLoadingMyRank } = useSubCollectiveRank(
    address,
    collectivePallet,
  );

  const myEligibleReferenda = useMemo(() => {
    if (isLoadingMyRank) {
      return [];
    }
    return activeReferenda?.filter(({ referendum }) => {
      const trackId = referendum.track.toNumber();
      const minRank = getMinRankOfClass(trackId, collectivePallet);
      return myRank >= minRank;
    });
  }, [activeReferenda, collectivePallet, myRank, isLoadingMyRank]);

  const myEligibleReferendaIndexes = useMemo(
    () => myEligibleReferenda?.map((r) => r.referendumIndex),
    [myEligibleReferenda],
  );

  const { referendaVotes, isLoading: isLoadingVotes } =
    useMyFellowshipReferendaVotes(myEligibleReferendaIndexes, trigger);

  const referendaToVote = useMemo(() => {
    const voted = referendaVotes.map((r) => r.referendumIndex);
    return myEligibleReferenda.filter(
      (r) => !voted.includes(r.referendumIndex),
    );
  }, [myEligibleReferenda, referendaVotes]);

  const countOfTotalReferenda = activeReferenda?.length || 0;
  const countOfEligibleReferenda = myEligibleReferenda?.length || 0;

  return {
    countOfTotalReferenda,
    countOfEligibleReferenda,
    referendaToVote,
    referendaVotes,
    isLoading: isLoadingActiveReferenda || isLoadingVotes || isLoadingMyRank,
  };
}
