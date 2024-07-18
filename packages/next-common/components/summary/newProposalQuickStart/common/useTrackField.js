import { useState } from "react";
import { useListPageType, usePageProps } from "next-common/context/page";
import { useChain } from "next-common/context/chain";
import Chains from "next-common/utils/consts/chains";
import DetailedTrack from "next-common/components/popup/fields/detailedTrackField";
import { listPageCategory } from "next-common/utils/consts/business/category";

export default function useTrackField() {
  const listPageType = useListPageType();
  const chain = useChain();

  const { tracks, fellowshipTracks, ambassadorTracks } = usePageProps();

  let trackList;
  let defaultTrackId;

  if (listPageType === listPageCategory.REFERENDA) {
    trackList = tracks;
    defaultTrackId = tracks[0].id;
    if ([Chains.polkadot, Chains.kusama].includes(chain)) {
      defaultTrackId = 2; // Wish for Change
    }
  } else if (listPageType === listPageCategory.FELLOWSHIP_REFERENDA) {
    trackList = fellowshipTracks;
    defaultTrackId = 3; // fellows
  } else if (listPageType === listPageCategory.AMBASSADOR_REFERENDA) {
    trackList = ambassadorTracks;
    defaultTrackId = trackList[0].id;
  }

  const [trackId, setTrackId] = useState(defaultTrackId);
  return {
    value: trackId,
    component: <DetailedTrack trackId={trackId} setTrackId={setTrackId} />,
  };
}
