import useGroupedReferenda from "./useGroupedReferenda";
import { useReferendaTracks } from "next-common/context/referenda/tracks";
import { useMemo } from "react";

function fillIdleTracks(allTracksIds, tracksWithReferenda) {
  return [...allTracksIds]
    .sort((a, b) => a - b)
    .map(
      (id) =>
        tracksWithReferenda.find(({ trackId }) => trackId === id) || {
          trackId: id,
          referenda: {
            preparing: [],
            queueing: [],
            deciding: [],
            confirming: [],
          },
        },
    );
}

function sortTracksByOngoingCount(tracks) {
  return [...tracks].sort((a, b) => {
    const aOngoingCount =
      a.referenda.deciding.length + a.referenda.confirming.length;
    const bOngoingCount =
      b.referenda.deciding.length + b.referenda.confirming.length;
    return bOngoingCount - aOngoingCount;
  });
}

export default function useTrackStatusData(hideIdleTracks, sortByOngoingCount) {
  const { tracks: tracksWithReferenda, isLoading: isLoadingGroupedReferenda } =
    useGroupedReferenda();
  const { tracks: allTracks, isLoading: isLoadingTracks } =
    useReferendaTracks();
  const isLoading = isLoadingGroupedReferenda || isLoadingTracks;

  const tracks = useMemo(() => {
    if (isLoading) {
      return [];
    }

    let tracks;

    if (hideIdleTracks) {
      tracks = tracksWithReferenda;
    } else {
      tracks = fillIdleTracks(
        allTracks.map(({ id }) => id),
        tracksWithReferenda,
      );
    }

    if (sortByOngoingCount) {
      tracks = sortTracksByOngoingCount(tracks);
    }

    return tracks;
  }, [
    tracksWithReferenda,
    allTracks,
    isLoading,
    hideIdleTracks,
    sortByOngoingCount,
  ]);

  return {
    tracks,
    isLoading,
  };
}
