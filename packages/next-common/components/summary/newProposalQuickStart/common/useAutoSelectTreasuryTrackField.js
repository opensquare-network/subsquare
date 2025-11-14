import { useMemo, useState } from "react";
import { usePageProps } from "next-common/context/page";
import AutoSelectTreasuryTrack from "next-common/components/popup/fields/autoSelectTreasuryTrack";
import { isCollectivesChain } from "next-common/utils/chain";
import { useChain, useChainSettings } from "next-common/context/chain";
import BigNumber from "bignumber.js";

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

  return {
    value: trackId,
    error,
    component: (
      <AutoSelectTreasuryTrack
        requestAmount={requestAmount}
        trackId={trackId}
        setTrackId={setTrackId}
      />
    ),
  };
}
