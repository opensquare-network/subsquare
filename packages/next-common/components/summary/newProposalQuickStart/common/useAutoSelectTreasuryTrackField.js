import { useState } from "react";
import { usePageProps } from "next-common/context/page";
import AutoSelectTreasuryTrack from "next-common/components/popup/fields/autoSelectTreasuryTrack";

export default function useAutoSelectTreasuryTrackField(
  requestAmount,
  defaultValue = null,
) {
  const { tracks } = usePageProps();
  const defaultTrackId = defaultValue || tracks[0].id;
  const [trackId, setTrackId] = useState(defaultTrackId);

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
