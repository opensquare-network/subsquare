import { useMemo } from "react";
import { useOnChainReferendaContext } from "next-common/context/onchainReferenda";

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
    if (ongoingReferenda.decisionDeposit.isNone) {
      counts.preparing++;
    } else if (ongoingReferenda.inQueue.isTrue) {
      counts.queueing++;
    } else if (ongoingReferenda.deciding.isSome) {
      const deciding = ongoingReferenda.deciding.unwrap();
      if (deciding.confirming.isSome) {
        counts.confirming++;
      } else {
        counts.deciding++;
      }
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
