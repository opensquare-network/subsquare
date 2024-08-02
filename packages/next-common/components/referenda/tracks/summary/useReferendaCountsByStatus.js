import { useMemo } from "react";
import { useOnChainReferendaContext } from "next-common/context/onchainReferenda";
import {
  eachOngoingReferenda,
  getOngoingReferendumStatus,
} from "next-common/utils/referenda";

function countReferendaByStatus(allReferenda) {
  const counts = {
    active: 0,
    preparing: 0,
    queueing: 0,
    deciding: 0,
    confirming: 0,
  };

  for (const [, ongoingReferenda] of eachOngoingReferenda(allReferenda)) {
    counts.active++;
    const status = getOngoingReferendumStatus(ongoingReferenda);
    if (status) {
      counts[status]++;
    }
  }

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
