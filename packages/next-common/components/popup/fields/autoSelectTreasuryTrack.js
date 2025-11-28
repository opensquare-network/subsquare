import { isNil } from "lodash-es";
import { useChainSettings } from "next-common/context/chain";
import { useEffect } from "react";
import DetailedTrack from "./detailedTrackField";
import BigNumber from "bignumber.js";

export default function AutoSelectTreasuryTrack({
  requestAmount,
  trackId,
  setTrackId,
  customTrackError = null,
}) {
  const { treasuryProposalTracks } = useChainSettings();

  useEffect(() => {
    if (!treasuryProposalTracks || !requestAmount) {
      return;
    }
    const track = treasuryProposalTracks.find(
      (track) =>
        isNil(track.max) || new BigNumber(requestAmount).lte(track.max),
    );
    if (track) {
      setTrackId(track?.id);
    }
  }, [requestAmount, setTrackId, treasuryProposalTracks]);

  return (
    <>
      <DetailedTrack trackId={trackId} setTrackId={setTrackId} />
      {customTrackError}
    </>
  );
}
