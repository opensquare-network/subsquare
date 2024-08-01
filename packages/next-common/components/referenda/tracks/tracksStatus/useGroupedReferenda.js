import { useOnChainReferendaContext } from "next-common/context/onchainReferenda";
import { useMemo } from "react";
import { getOngoingReferendaStatus } from "../common";

function groupReferenda(allReferenda) {
  const tracks = {};

  allReferenda.forEach(([key, referenda]) => {
    const unwrappedReferenda = referenda.unwrap();
    if (!unwrappedReferenda.isOngoing) {
      return;
    }

    const ongoingReferenda = unwrappedReferenda.asOngoing;
    const trackId = ongoingReferenda.track.toNumber();
    if (!tracks[trackId]) {
      tracks[trackId] = {
        preparing: [],
        queueing: [],
        deciding: [],
        confirming: [],
      };
    }
    const status = getOngoingReferendaStatus(ongoingReferenda);
    if (status) {
      const {
        args: [id],
      } = key;
      const referendumIndex = id.toNumber();
      tracks[trackId][status].push(referendumIndex);
    }
  });

  const result = Object.entries(tracks).map(([trackId, referenda]) => ({
    trackId: parseInt(trackId),
    referenda,
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
