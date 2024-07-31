import { useMemo } from "react";
import useReferendaTracks from "./useReferendaTracks";

export default function useReferendaTrackDetail(trackId) {
  const tracks = useReferendaTracks();
  return useMemo(
    () => tracks.find(({ id }) => id === trackId),
    [trackId, tracks],
  );
}
