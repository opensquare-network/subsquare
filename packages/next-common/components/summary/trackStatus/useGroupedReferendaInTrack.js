import { useMemo } from "react";
import {
  getOngoingReferendumStatus,
  QueueingReferenda,
} from "next-common/utils/referenda";
import useOnChainOngoingReferenda from "next-common/context/onchainReferenda/ongoingReferenda";

function groupOngoingReferendaInTrack(trackId, allOngoingReferenda) {
  const groups = {
    preparing: [],
    queueing: new QueueingReferenda(),
    deciding: [],
    confirming: [],
  };

  for (const [referendumIndex, ongoingReferendum] of allOngoingReferenda) {
    const currTrackId = ongoingReferendum.track.toNumber();
    if (currTrackId !== trackId) {
      continue;
    }

    const status = getOngoingReferendumStatus(ongoingReferendum);
    if (status) {
      if (status === "queueing") {
        groups.queueing.addReferendum(referendumIndex, ongoingReferendum);
      } else {
        groups[status].push(referendumIndex);
      }
    }
  }

  return {
    ...groups,
    queueing: groups.queueing.toSortedReferendumIndexes(),
  };
}

export default function useGroupedReferendaInTrack(trackId) {
  const { ongoingReferenda, isLoading } = useOnChainOngoingReferenda();

  const groups = useMemo(() => {
    if (isLoading) {
      return {
        preparing: [],
        queueing: [],
        deciding: [],
        confirming: [],
      };
    }
    return groupOngoingReferendaInTrack(trackId, ongoingReferenda);
  }, [isLoading, ongoingReferenda, trackId]);

  return {
    referenda: groups,
    isLoading,
  };
}
