import { useMemo } from "react";
import { useOnChainReferendaContext } from "next-common/context/onchainReferenda";
import { getOngoingReferendaStatus } from "../common";

function countReferendaByStatus(allReferenda) {
  const counts = {
    active: 0,
    preparing: 0,
    queueing: 0,
    deciding: 0,
    confirming: 0,
  };

  allReferenda.forEach(([, referenda]) => {
    const unwrappedReferenda = referenda.unwrap();
    if (!unwrappedReferenda.isOngoing) {
      return;
    }

    counts.active++;

    const ongoingReferenda = unwrappedReferenda.asOngoing;
    const status = getOngoingReferendaStatus(ongoingReferenda);
    if (status) {
      counts[status]++;
    }
  });

  return counts;
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
