import { useState } from "react";
import { usePageProps } from "next-common/context/page";
import { useChain } from "next-common/context/chain";
import Chains from "next-common/utils/consts/chains";
import DetailedTrack from "next-common/components/popup/fields/detailedTrackField";

export default function useTrackField() {
  const { tracks } = usePageProps();

  let defaultTrackId = tracks[0].id;
  const chain = useChain();
  if ([Chains.polkadot, Chains.kusama].includes(chain)) {
    defaultTrackId = 2; // Wish for Change
  }

  const [trackId, setTrackId] = useState(defaultTrackId);
  return {
    value: trackId,
    component: <DetailedTrack trackId={trackId} setTrackId={setTrackId} />,
  };
}
