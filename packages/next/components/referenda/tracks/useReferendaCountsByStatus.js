import { useMemo } from "react";
import { useOnChainReferendaContext } from "next-common/context/onchainReferenda";
import { groupReferenda } from "./common";

function countReferendaByStatus(allReferenda) {
  const groups = groupReferenda(allReferenda);

  const preparing = groups.preparing.length;
  const queueing = groups.queueing.length;
  const deciding = groups.deciding.length;
  const confirming = groups.confirming.length;
  const active = preparing + queueing + deciding + confirming;

  return {
    preparing,
    queueing,
    deciding,
    confirming,
    active,
  };
}

export default function useReferendaCountsByStatus() {
  const { referenda, isLoading } = useOnChainReferendaContext();
  return useMemo(() => {
    if (isLoading) {
      return {
        total: 0,
        active: 0,
        preparing: 0,
        queueing: 0,
        deciding: 0,
        confirming: 0,
      };
    }

    return {
      total: referenda.length,
      ...countReferendaByStatus(referenda),
    };
  }, [isLoading, referenda]);
}
