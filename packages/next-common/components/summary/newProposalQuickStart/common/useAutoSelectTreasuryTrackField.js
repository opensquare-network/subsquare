import { useState } from "react";
import { usePageProps } from "next-common/context/page";
import AutoSelectTreasuryTrack from "next-common/components/popup/fields/autoSelectTreasuryTrack";

export default function useAutoSelectTreasuryTrackField(requestAmount) {
  const { tracks } = usePageProps();
  const [trackId, setTrackId] = useState(tracks[0].id);

  return {
    value: trackId,
    component: (
      <AutoSelectTreasuryTrack
        requestAmount={requestAmount}
        trackId={trackId}
        setTrackId={setTrackId}
      />
    ),
  };
}
