import { useMemo } from "react";
import { useReferendaTracks } from "next-common/context/referenda/tracks";

export default function useReferendaTrackDetail(trackId) {
  const { tracks, isLoading } = useReferendaTracks();

  const track = useMemo(() => {
    if (isLoading) {
      return null;
    }
    return (tracks || []).find(({ id }) => id === trackId);
  }, [trackId, tracks, isLoading]);

  return {
    track,
    isLoading,
  };
}
