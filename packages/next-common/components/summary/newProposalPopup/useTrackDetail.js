import { usePageProps } from "next-common/context/page";
import { useMemo } from "react";

export default function useTrackDetail(trackId) {
  const { tracksDetail } = usePageProps();
  return useMemo(
    () => (tracksDetail || []).find((track) => track.id === trackId),
    [trackId, tracksDetail],
  );
}
