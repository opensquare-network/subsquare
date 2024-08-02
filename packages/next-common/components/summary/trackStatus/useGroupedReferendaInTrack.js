import { useOnChainReferendaContext } from "next-common/context/onchainReferenda";
import { useMemo } from "react";
import {
  eachOngoingReferenda,
  getOngoingReferendaStatus,
  QueueingReferenda,
} from "next-common/utils/referenda";

function groupOngoingReferendaInTrack(trackId, allReferenda) {
  const groups = {
    preparing: [],
    queueing: new QueueingReferenda(),
    deciding: [],
    confirming: [],
  };

  for (const [referendumIndex, ongoingReferenda] of eachOngoingReferenda(
    allReferenda,
  )) {
    const currTrackId = ongoingReferenda.track.toNumber();
    if (currTrackId !== trackId) {
      continue;
    }

    const status = getOngoingReferendaStatus(ongoingReferenda);
    if (status) {
      if (status === "queueing") {
        groups.queueing.addReferendum(referendumIndex, ongoingReferenda);
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
  const { referenda, isLoading } = useOnChainReferendaContext();

  const groups = useMemo(() => {
    if (isLoading) {
      return {
        preparing: [],
        queueing: [],
        deciding: [],
        confirming: [],
      };
    }
    return groupOngoingReferendaInTrack(trackId, referenda);
  }, [isLoading, referenda, trackId]);

  return {
    referenda: groups,
    isLoading,
  };
}
