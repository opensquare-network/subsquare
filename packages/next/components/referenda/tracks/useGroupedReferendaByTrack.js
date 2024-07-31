import { useOnChainReferendaContext } from "next-common/context/onchainReferenda";
import { useMemo } from "react";
import { groupReferenda } from "./common";

export default function useGroupedReferendaByTrack() {
  const { referenda, isLoading } = useOnChainReferendaContext();

  return useMemo(() => {
    if (isLoading) {
      return {
        preparing: [],
        queueing: [],
        deciding: [],
        confirming: [],
      };
    }

    return groupReferenda(referenda);
  }, [isLoading, referenda]);
}
