import { useMemo } from "react";
import {
  getOngoingReferendumStatus,
  QueueingReferenda,
} from "next-common/utils/referenda";
import useOnChainOngoingReferenda from "next-common/context/onchainReferenda/ongoingReferenda";

function groupReferenda(allOngoingReferenda) {
  const tracks = {};

  for (const [referendumIndex, ongoingReferendum] of allOngoingReferenda) {
    const trackId = ongoingReferendum.track.toNumber();
    if (!tracks[trackId]) {
      tracks[trackId] = {
        preparing: [],
        queueing: new QueueingReferenda(),
        deciding: [],
        confirming: [],
      };
    }
    const status = getOngoingReferendumStatus(ongoingReferendum);
    if (status) {
      if (status === "queueing") {
        tracks[trackId].queueing.addReferendum(
          referendumIndex,
          ongoingReferendum,
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
  const { ongoingReferenda, isLoading } = useOnChainOngoingReferenda();

  const tracks = useMemo(() => {
    if (isLoading) {
      return [];
    }
    return groupReferenda(ongoingReferenda);
  }, [isLoading, ongoingReferenda]);

  return {
    tracks,
    isLoading,
  };
}
