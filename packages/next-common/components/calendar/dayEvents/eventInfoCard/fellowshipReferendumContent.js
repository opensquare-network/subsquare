import React from "react";
import {
  fellowshipReferendumBaseUrl,
  fellowshipTrackBaseUrl,
} from "../../../../utils/postBaseUrl";
import CallItem from "./infoItem/callItem";
import IndexItem from "./infoItem/indexItem";
import ProposerItem from "./infoItem/proposerItem";
import TitleItem from "./infoItem/titleItem";
import TrackItem from "./infoItem/trackItem";

export default function FellowshipReferendumContent({ index, data }) {
  return (
    <>
      <IndexItem index={index} baseUrl={fellowshipReferendumBaseUrl} />
      <TitleItem title={data?.postTitle} />
      <ProposerItem proposer={data.proposer} />
      <TrackItem
        track={data?.track}
        trackName={data?.trackName}
        baseUrl={fellowshipTrackBaseUrl}
      />
      <CallItem proposal={data.proposal?.call} />
    </>
  );
}
