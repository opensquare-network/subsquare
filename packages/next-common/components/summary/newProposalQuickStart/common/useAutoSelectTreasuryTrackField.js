import { useState } from "react";
import { usePageProps } from "next-common/context/page";
import AutoSelectTreasuryTrack from "next-common/components/popup/fields/autoSelectTreasuryTrack";
import { isCollectivesChain } from "next-common/utils/chain";
import { useChain } from "next-common/context/chain";

export default function useAutoSelectTreasuryTrackField(
  requestAmount,
  defaultValue = null,
) {
  const chain = useChain();
  const { tracks: referendaTracks, fellowshipTracks } = usePageProps();
  let tracks = referendaTracks;
  if (isCollectivesChain(chain)) {
    tracks = fellowshipTracks;
  }
  const defaultTrackId = defaultValue || tracks[0]?.id;
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
