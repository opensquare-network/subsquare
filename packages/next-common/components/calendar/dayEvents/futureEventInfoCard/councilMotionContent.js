import React from "react";
import useCouncilMotionTitle from "../../../../hooks/useCouncilMotionTitle";
import { councilMotionBaseUrl } from "../../../../utils/postBaseUrl";
import MotionIndexItem from "../eventInfoCard/infoItem/motionIndexItem";
import TitleItem from "../eventInfoCard/infoItem/titleItem";
import BlockHeightItem from "./infoItem/blockHeight";

export default function CouncilMotionContent({ event }) {
  const title = useCouncilMotionTitle(event?.index);
  return (
    <>
      <MotionIndexItem
        motionHash={event?.index}
        baseUrl={councilMotionBaseUrl}
      />
      <BlockHeightItem blockHeight={event?.indexer.blockHeight} />
      <TitleItem title={title} />
    </>
  );
}
