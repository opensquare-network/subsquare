import React from "react";
import { councilMotionBaseUrl } from "../../../../utils/postBaseUrl";
import MotionIndexItem from "../eventInfoCard/infoItem/motionIndexItem";
import BlockHeightItem from "./infoItem/blockHeight";

export default function CouncilMotionContent({ event }) {
  return (
    <>
      <MotionIndexItem
        motionHash={event?.index}
        baseUrl={councilMotionBaseUrl}
      />
      <BlockHeightItem blockHeight={event?.indexer.blockHeight} />
    </>
  );
}
