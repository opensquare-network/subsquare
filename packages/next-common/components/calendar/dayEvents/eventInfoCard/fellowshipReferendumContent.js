import React from "react";
import {
  fellowshipReferendumBaseUrl,
  fellowshipTrackBaseUrl,
} from "../../../../utils/postBaseUrl";
import IndexItem from "./infoItem/indexItem";
import ProposerItem from "./infoItem/proposerItem";
import TrackItem from "./infoItem/trackItem";

export default function FellowshipReferendumContent({ index, data }) {
  return (
    <>
      <IndexItem index={index} baseUrl={fellowshipReferendumBaseUrl} />
      <ProposerItem proposer={data.proposer} />
      <TrackItem
        track={data?.track}
        trackName={data?.trackName}
        baseUrl={fellowshipTrackBaseUrl}
      />
    </>
  );
}
