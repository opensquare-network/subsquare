import { useEffect, useMemo, useState } from "react";
import { usePageProps } from "next-common/context/page";
import AutoSelectTreasuryTrack from "next-common/components/popup/fields/autoSelectTreasuryTrack";
import { isCollectivesChain, isBifrostChain } from "next-common/utils/chain";
import { useChain, useChainSettings } from "next-common/context/chain";
import BigNumber from "bignumber.js";
import ErrorInfoPanel from "next-common/components/summary/styled/errorInfoPanel";

export const AutoSelectTreasuryTrackErrors = {
  OverMax: "OverMax",
};

export default function useAutoSelectTreasuryTrackField(
  requestAmount,
  defaultValue = null,
) {
  const chain = useChain();
  const { tracks: referendaTracks, fellowshipTracks } = usePageProps();
  const { treasuryProposalTracks } = useChainSettings();
  let tracks = referendaTracks;
  if (isCollectivesChain(chain)) {
    tracks = fellowshipTracks;
  }
  const defaultTrackId = defaultValue || tracks[0]?.id;
  const [trackId, setTrackId] = useState(defaultTrackId);
  const [showTrackError, setShowTrackError] = useState(false);

  const error = useMemo(() => {
    if (
      requestAmount &&
      !(treasuryProposalTracks || []).some((track) =>
        new BigNumber(requestAmount).lte(track.max),
      )
    ) {
      return AutoSelectTreasuryTrackErrors.OverMax;
    }

    return null;
  }, [treasuryProposalTracks, requestAmount]);

  useEffect(() => {
    if (!isBifrostChain(chain)) {
      return;
    }

    if (!requestAmount || !trackId || !treasuryProposalTracks?.length) {
      setShowTrackError(false);
      return;
    }

    const selectedTrack = treasuryProposalTracks.find(
      (track) => track.id === trackId,
    );

    if (!selectedTrack?.max) {
      setShowTrackError(false);
      return;
    }

    const isExceeding = new BigNumber(requestAmount).gt(selectedTrack.max);
    setShowTrackError(isExceeding);
  }, [chain, requestAmount, trackId, treasuryProposalTracks]);

  const customTrackError = useMemo(() => {
    if (!showTrackError) {
      return null;
    }

    return (
      <ErrorInfoPanel>
        Request amount exceeds the selected track&apos;s maximum limit
      </ErrorInfoPanel>
    );
  }, [showTrackError]);

  return {
    value: trackId,
    error,
    component: (
      <AutoSelectTreasuryTrack
        requestAmount={requestAmount}
        trackId={trackId}
        setTrackId={setTrackId}
        customTrackError={customTrackError}
      />
    ),
  };
}
