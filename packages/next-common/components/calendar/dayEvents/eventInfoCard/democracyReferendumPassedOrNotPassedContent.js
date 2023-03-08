import React from "react";
import { democracyReferendumBaseUrl } from "../../../../utils/postBaseUrl";
import AyesItem from "./infoItem/ayesItem";
import ElectorateItem from "./infoItem/electorateItem";
import IndexItem from "./infoItem/indexItem";
import NaysItem from "./infoItem/naysItem";
import TitleItem from "./infoItem/titleItem";
import TurnoutItem from "./infoItem/turnoutItem";

export default function DemocracyReferendumPassedOrNotPassedContent({
  referendumIndex,
  data,
}) {
  return (
    <>
      <IndexItem index={referendumIndex} baseUrl={democracyReferendumBaseUrl} />
      <TitleItem title={data?.postTitle} />
      <AyesItem ayes={data?.tally?.ayes} />
      <NaysItem nays={data?.tally?.nays} />
      <TurnoutItem turnout={data?.tally?.turnout} />
      <ElectorateItem electorate={data?.tally?.electorate} />
    </>
  );
}
