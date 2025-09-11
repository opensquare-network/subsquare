import { useState } from "react";
import DetailedTrack from "next-common/components/popup/fields/detailedTrackField";

export default function useTrackField(defaultTrackId) {
  const [trackId, setTrackId] = useState(defaultTrackId);
  return {
    value: trackId,
    component: <DetailedTrack trackId={trackId} setTrackId={setTrackId} />,
  };
}
