import React from "react";
import { treasuryProposalBaseUrl } from "../../../../utils/postBaseUrl";
import IndexItem from "./infoItem/indexItem";
import ValueItem from "./infoItem/valueItem";
import BeneficiaryItem from "./infoItem/beneficiaryItem";
import ProposerItem from "./infoItem/proposerItem";
import TitleItem from "./infoItem/titleItem";

export default function TreasuryProposalApprovedContent({
  proposalIndex,
  data,
}) {
  return (
    <>
      <TitleItem title={data?.postTitle} />
      <IndexItem index={proposalIndex} baseUrl={treasuryProposalBaseUrl} />
      <ValueItem value={data.value} />
      <BeneficiaryItem beneficiary={data.beneficiary} />
      <ProposerItem proposer={data.proposer} />
    </>
  );
}
