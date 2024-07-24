import { difference } from "lodash-es";
import useSubAllActiveReferenda from "./useSubAllActiveReferenda";
import useSubAllMyVotedReferenda from "./useSubAllMyVotedReferenda";
import { useMemo } from "react";

export default function useSubAllMyUnVotedReferenda() {
  const { activeReferenda, isLoading: isLoadingActiveReferenda } =
    useSubAllActiveReferenda();

  const { myVotedReferenda, isLoading: isLoadingMyVotes } =
    useSubAllMyVotedReferenda();

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
