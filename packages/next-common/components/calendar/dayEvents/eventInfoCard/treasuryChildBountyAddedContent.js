import {
  bountyBaseUrl,
  childBountyBaseUrl,
} from "../../../../utils/postBaseUrl";
import DescriptionItem from "./infoItem/descriptionItem";
import IndexItem from "./infoItem/indexItem";
import ProposerItem from "./infoItem/proposerItem";
import React from "react";
import ValueItem from "./infoItem/valueItem";
import TitleItem from "./infoItem/titleItem";

export default function TreasuryChildBountyAddedContent({
  childBountyIndex,
  data,
}) {
  return (
    <>
      <TitleItem title={data?.postTitle} />
      <IndexItem index={childBountyIndex} baseUrl={childBountyBaseUrl} />
      <IndexItem
        index={data.parentBountyIndex}
        itemName="Parent bounty index"
        baseUrl={bountyBaseUrl}
      />
      <ProposerItem proposer={data.proposer} />
      <ValueItem value={data.value} />
      <DescriptionItem description={data.description} />
    </>
  );
}
