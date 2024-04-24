import React from "react";
import { noop } from "lodash-es";
import { usePageProps } from "../../../context/page";
import CommonDetailedTrack from "./commonDetailedTrack";

export default function DetailedFellowshipTrack({
  title = "Track",
  trackId,
  setTrackId = noop,
}) {
  const { fellowshipTracks, fellowshipTracksDetail } = usePageProps();
  const trackList = fellowshipTracksDetail || fellowshipTracks;
  return (
    <CommonDetailedTrack
      title={title}
      trackId={trackId}
      setTrackId={setTrackId}
      trackList={trackList}
    />
  );
}
