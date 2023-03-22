import React from "react";
import { bountyBaseUrl } from "../../../../utils/postBaseUrl";
import BeneficiaryItem from "./infoItem/beneficiaryItem";
import DescriptionItem from "./infoItem/descriptionItem";
import IndexItem from "./infoItem/indexItem";
import PayoutItem from "./infoItem/payoutItem";
import TitleItem from "./infoItem/titleItem";

export default function TreasuryBountyClaimedContent({ bountyIndex, data }) {
  return (
    <>
      <TitleItem title={data?.postTitle} />
      <IndexItem index={bountyIndex} baseUrl={bountyBaseUrl} />
      <BeneficiaryItem beneficiary={data.beneficiary} />
      <PayoutItem payout={data.payout} />
      <DescriptionItem description={data.description} />
    </>
  );
}
