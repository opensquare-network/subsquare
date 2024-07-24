import { difference } from "lodash-es";
import useCollectiveActiveReferenda from "./useCollectiveActiveReferenda";
import useMyVotedCollectiveReferenda from "./useMyVotedCollectiveReferenda";
import { useMemo } from "react";
import { useRankedCollectivePallet } from "next-common/context/collectives/collectives";
import { getMinRankOfClass } from "next-common/context/post/fellowship/useMaxVoters";
import useSubCollectiveRank from "../collectives/useSubCollectiveRank";
import useRealAddress from "next-common/utils/hooks/useRealAddress";

function useCollectiveActiveReferendaICanVote() {
  const { activeReferenda, isLoading: isLoadingActiveReferenda } =
    useCollectiveActiveReferenda();

  const collectivePallet = useRankedCollectivePallet();
  const address = useRealAddress();
  const { rank: myRank, loading: isLoadingMyRank } = useSubCollectiveRank(
    address,
    collectivePallet,
  );

  const isLoading = isLoadingActiveReferenda || isLoadingMyRank;

  const referendaICanVote = useMemo(() => {
    if (isLoading) {
      return;
    }

    return activeReferenda
      .filter(({ trackId }) => {
        let minRank = getMinRankOfClass(trackId, collectivePallet);
        return myRank >= minRank;
      })
      .map(({ referendumIndex }) => referendumIndex);
  }, [collectivePallet, activeReferenda, isLoading, myRank]);

  return {
    referendaICanVote,
    isLoading,
  };
}

export default function useMyUnVotedCollectiveReferenda() {
  const { referendaICanVote, isLoading: isLoadingActiveReferenda } =
    useCollectiveActiveReferendaICanVote();

  const { myVotedReferenda, isLoading: isLoadingMyVotes } =
    useMyVotedCollectiveReferenda();

  const isLoading = isLoadingActiveReferenda || isLoadingMyVotes;

  const myUnVotedReferenda = useMemo(() => {
    if (isLoading) {
      return;
    }
    return difference(referendaICanVote, myVotedReferenda);
  }, [referendaICanVote, myVotedReferenda, isLoading]);

  return {
    myUnVotedReferenda,
    isLoading,
  };
}
