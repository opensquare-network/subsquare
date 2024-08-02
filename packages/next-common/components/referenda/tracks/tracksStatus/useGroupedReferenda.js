import { useOnChainReferendaContext } from "next-common/context/onchainReferenda";
import { useMemo } from "react";
import {
  eachOngoingReferenda,
  getOngoingReferendaStatus,
  QueueingReferenda,
} from "next-common/utils/referenda";

function groupReferenda(allReferenda) {
  const tracks = {};

  for (const [referendumIndex, ongoingReferenda] of eachOngoingReferenda(
    allReferenda,
  )) {
    const trackId = ongoingReferenda.track.toNumber();
    if (!tracks[trackId]) {
      tracks[trackId] = {
        preparing: [],
        queueing: new QueueingReferenda(),
        deciding: [],
        confirming: [],
      };
    }
    const status = getOngoingReferendaStatus(ongoingReferenda);
    if (status) {
      if (status === "queueing") {
        tracks[trackId].queueing.addReferendum(
          referendumIndex,
          ongoingReferenda,
        );
      } else {
        tracks[trackId][status].push(referendumIndex);
      }
    }
  }

  const result = Object.entries(tracks).map(([trackId, referenda]) => ({
    trackId: parseInt(trackId),
    referenda: {
      ...referenda,
      queueing: referenda.queueing.toSortedReferendumIndexes(),
    },
  }));
  result.sort((a, b) => a.TrackId - b.TrackId);

  return result;
}

export default function useGroupedReferenda() {
  const { referenda, isLoading } = useOnChainReferendaContext();

  const tracks = useMemo(() => {
    if (isLoading) {
      return [];
    }
    return groupReferenda(referenda);
  }, [isLoading, referenda]);

  return {
    tracks,
    isLoading,
  };
}
