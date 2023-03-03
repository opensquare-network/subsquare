import React from "react";
import {
  referendaReferendumBaseUrl,
  referendaTrackBaseUrl,
} from "../../../../utils/postBaseUrl";
import IndexItem from "./infoItem/indexItem";
import ProposerItem from "./infoItem/proposerItem";
import TrackItem from "./infoItem/trackItem";

export default function referendaReferendumContent({ index, data }) {
  return (
    <>
      <IndexItem index={index} baseUrl={referendaReferendumBaseUrl} />
      <ProposerItem proposer={data.proposer} />
      <TrackItem
        track={data?.track}
        trackName={data?.trackName}
        baseUrl={referendaTrackBaseUrl}
      />
    </>
  );
}
