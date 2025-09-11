import { isNil } from "lodash-es";
import { useChainSettings } from "next-common/context/chain";
import { useEffect } from "react";
import DetailedTrack from "./detailedTrackField";

export default function AutoSelectTreasuryTrack({
  requestAmount,
  trackId,
  setTrackId,
}) {
  const { treasuryProposalTracks } = useChainSettings();

  useEffect(() => {
    if (!treasuryProposalTracks || !requestAmount) {
      return;
    }
    const track = treasuryProposalTracks.find(
      (track) => isNil(track.max) || track.max >= parseFloat(requestAmount),
    );
    if (track) {
      setTrackId(track?.id);
    }
  }, [requestAmount, setTrackId, treasuryProposalTracks]);

  return <DetailedTrack trackId={trackId} setTrackId={setTrackId} />;
}
