import React from "react";
import { noop } from "lodash-es";
import { usePageProps } from "../../../context/page";
import CommonDetailedTrack from "./commonDetailedTrack";
import { useCollectivesContext } from "next-common/context/collectives/collectives";

export default function DetailedFellowshipTrack({
  title = "Track",
  trackId,
  setTrackId = noop,
}) {
  const { section } = useCollectivesContext();
  const {
    fellowshipTracks,
    fellowshipTracksDetail,
    ambassadorTracks,
    ambassadorTracksDetail,
  } = usePageProps();

  let trackList = fellowshipTracksDetail || fellowshipTracks;
  if (section === "fellowship") {
    trackList = fellowshipTracksDetail || fellowshipTracks;
  } else if (section === "ambassador") {
    trackList = ambassadorTracksDetail || ambassadorTracks;
  }

  return (
    <CommonDetailedTrack
      title={title}
      trackId={trackId}
      setTrackId={setTrackId}
      trackList={trackList}
    />
  );
}
