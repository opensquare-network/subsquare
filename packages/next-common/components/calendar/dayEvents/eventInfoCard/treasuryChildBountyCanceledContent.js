import React from "react";
import {
  bountyBaseUrl,
  childBountyBaseUrl,
} from "../../../../utils/postBaseUrl";
import DescriptionItem from "./infoItem/descriptionItem";
import IndexItem from "./infoItem/indexItem";
import TitleItem from "./infoItem/titleItem";

export default function TreasuryChildBountyCanceledContent({
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
      <DescriptionItem description={data.description} />
    </>
  );
}
