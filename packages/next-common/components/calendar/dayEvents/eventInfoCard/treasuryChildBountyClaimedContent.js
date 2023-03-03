import React from "react";
import {
  bountyBaseUrl,
  childBountyBaseUrl,
} from "../../../../utils/postBaseUrl";
import BeneficiaryItem from "./infoItem/beneficiaryItem";
import DescriptionItem from "./infoItem/descriptionItem";
import IndexItem from "./infoItem/indexItem";
import PayoutItem from "./infoItem/payoutItem";

export default function TreasuryChildBountyClaimedContent({
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
      <BeneficiaryItem beneficiary={data.beneficiary} />
      <PayoutItem payout={data.payout} />
      <DescriptionItem description={data.description} />
    </>
  );
}
