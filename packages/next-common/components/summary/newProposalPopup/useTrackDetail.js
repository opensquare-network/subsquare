import { useChain } from "next-common/context/chain";
import { useListPageType, usePageProps } from "next-common/context/page";
import { listPageCategory } from "next-common/utils/consts/business/category";
import Chains from "next-common/utils/consts/chains";
import { useMemo } from "react";

export function useDefaultTrackId() {
  const chain = useChain();
  const listPageType = useListPageType();
  const trackList = useTrackList();

  let defaultTrackId;

  if (listPageType === listPageCategory.REFERENDA) {
    defaultTrackId = trackList[0].id;
    if ([Chains.polkadot, Chains.kusama].includes(chain)) {
      defaultTrackId = 2; // Wish for Change
    }
  } else if (listPageType === listPageCategory.FELLOWSHIP_REFERENDA) {
    defaultTrackId = 3; // fellows
  } else if (listPageType === listPageCategory.AMBASSADOR_REFERENDA) {
    defaultTrackId = trackList[0].id;
  }

  return defaultTrackId;
}

export function useTrackList() {
  const listPageType = useListPageType();

  const { tracks, fellowshipTracks, ambassadorTracks } = usePageProps();

  if (listPageType === listPageCategory.FELLOWSHIP_REFERENDA) {
    return fellowshipTracks;
  } else if (listPageType === listPageCategory.AMBASSADOR_REFERENDA) {
    return ambassadorTracks;
  } else {
    return tracks;
  }
}

export function useTrackDetailList() {
  const listPageType = useListPageType();

  const { tracksDetail, fellowshipTracksDetail, ambassadorTracksDetail } =
    usePageProps();

  if (listPageType === listPageCategory.FELLOWSHIP_REFERENDA) {
    return fellowshipTracksDetail;
  } else if (listPageType === listPageCategory.AMBASSADOR_REFERENDA) {
    return ambassadorTracksDetail;
  } else {
    return tracksDetail;
  }
}

export default function useTrackDetail(trackId) {
  const tracksDetailList = useTrackDetailList();
  return useMemo(
    () => (tracksDetailList || []).find((track) => track.id === trackId),
    [trackId, tracksDetailList],
  );
}
