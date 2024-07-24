import { difference } from "lodash-es";
import useCollectiveActiveReferenda from "./useCollectiveActiveReferenda";
import useMyVotedCollectiveReferenda from "./useMyVotedCollectiveReferenda";
import { useMemo } from "react";

export default function useMyUnVotedCollectiveReferenda() {
  const { activeReferenda, isLoading: isLoadingActiveReferenda } =
    useCollectiveActiveReferenda();

  const { myVotedReferenda, isLoading: isLoadingMyVotes } =
    useMyVotedCollectiveReferenda();

  const myUnVotedReferenda = useMemo(() => {
    if (isLoadingActiveReferenda || isLoadingMyVotes) {
      return;
    }
    return difference(activeReferenda, myVotedReferenda);
  }, [
    activeReferenda,
    isLoadingActiveReferenda,
    myVotedReferenda,
    isLoadingMyVotes,
  ]);

  return {
    myUnVotedReferenda,
    isLoading: isLoadingActiveReferenda || isLoadingMyVotes,
  };
}
