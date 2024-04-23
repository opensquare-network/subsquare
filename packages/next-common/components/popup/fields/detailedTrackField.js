import React from "react";
import { noop } from "lodash-es";
import { usePageProps } from "../../../context/page";
import CommonDetailedTrack from "./commonDetailedTrack";

export default function DetailedTrack({ trackId, setTrackId = noop }) {
  const { tracks, tracksDetail } = usePageProps();
  const trackList = tracksDetail || tracks;
  return (
    <CommonDetailedTrack
      title={"Track"}
      trackId={trackId}
      setTrackId={setTrackId}
      trackList={trackList}
    />
  );
}
