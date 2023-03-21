import React from "react";
import useReferendumTitle from "../../../../hooks/useReferendumTitle";
import { democracyReferendumBaseUrl } from "../../../../utils/postBaseUrl";
import IndexItem from "../eventInfoCard/infoItem/indexItem";
import TitleItem from "../eventInfoCard/infoItem/titleItem";
import BlockHeightItem from "./infoItem/blockHeight";

export default function DemocracyReferendumContent({ event }) {
  const title = useReferendumTitle(event?.index);
  return (
    <>
      <IndexItem index={event?.index} baseUrl={democracyReferendumBaseUrl} />
      <BlockHeightItem blockHeight={event?.indexer.blockHeight} />
      <TitleItem title={title} />
    </>
  );
}
