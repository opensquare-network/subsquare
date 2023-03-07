import React from "react";
import {
  bountyBaseUrl,
  childBountyBaseUrl,
} from "../../../../utils/postBaseUrl";
import BeneficiaryItem from "./infoItem/beneficiaryItem";
import DescriptionItem from "./infoItem/descriptionItem";
import IndexItem from "./infoItem/indexItem";
import TitleItem from "./infoItem/titleItem";
import ValueItem from "./infoItem/valueItem";

export default function TreasuryChildBountyAwardedContent({
  childBountyIndex,
  data,
}) {
  return (
    <>
      <IndexItem index={childBountyIndex} baseUrl={childBountyBaseUrl} />
      <IndexItem
        index={data.parentBountyIndex}
        itemName="Parent bounty index"
        baseUrl={bountyBaseUrl}
      />
      <TitleItem title={data?.postTitle} />
      <BeneficiaryItem beneficiary={data.beneficiary} />
      <ValueItem value={data.value} />
      <DescriptionItem description={data.description} />
    </>
  );
}
