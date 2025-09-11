import React from "react";
import { noop } from "lodash-es";
import { useListPageType, usePageProps } from "../../../context/page";
import CommonDetailedTrack from "./commonDetailedTrack";
import { listPageCategory } from "next-common/utils/consts/business/category";

export default function DetailedTrack({ trackId, setTrackId = noop }) {
  const listPageType = useListPageType();

  const {
    tracks,
    tracksDetail,
    fellowshipTracks,
    fellowshipTracksDetail,
    ambassadorTracks,
    ambassadorTracksDetail,
  } = usePageProps();

  let trackList = tracksDetail || tracks;

  if (listPageType === listPageCategory.FELLOWSHIP_REFERENDA) {
    trackList = fellowshipTracksDetail || fellowshipTracks;
  } else if (listPageType === listPageCategory.AMBASSADOR_REFERENDA) {
    trackList = ambassadorTracksDetail || ambassadorTracks;
  }

  return (
    <CommonDetailedTrack
      title={"Track"}
      trackId={trackId}
      setTrackId={setTrackId}
      trackList={trackList}
    />
  );
}
