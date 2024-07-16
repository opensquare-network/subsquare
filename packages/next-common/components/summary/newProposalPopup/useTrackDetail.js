import { useListPageType, usePageProps } from "next-common/context/page";
import { listPageCategory } from "next-common/utils/consts/business/category";
import { useMemo } from "react";

export default function useTrackDetail(trackId) {
  const listPageType = useListPageType();

  const { tracksDetail, fellowshipTracksDetail, ambassadorTracksDetail } =
    usePageProps();

  let tracksdetailList = tracksDetail;
  if (listPageType === listPageCategory.FELLOWSHIP_REFERENDA) {
    tracksdetailList = fellowshipTracksDetail;
  } else if (listPageType === listPageCategory.AMBASSADOR_REFERENDA) {
    tracksdetailList = ambassadorTracksDetail;
  }

  return useMemo(
    () => (tracksdetailList || []).find((track) => track.id === trackId),
    [trackId, tracksdetailList],
  );
}
