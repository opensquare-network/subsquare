import React from "react";
import { democracyReferendumBaseUrl } from "../../../../utils/postBaseUrl";
import IndexItem from "../eventInfoCard/infoItem/indexItem";
import BlockHeightItem from "./infoItem/blockHeight";

export default function DemocracyReferendumContent({ event }) {
  return (
    <>
      <IndexItem index={event?.index} baseUrl={democracyReferendumBaseUrl} />
      <BlockHeightItem blockHeight={event?.indexer.blockHeight} />
    </>
  );
}
