import React from "react";
import { treasuryProposalBaseUrl } from "../../../../utils/postBaseUrl";
import IndexItem from "./infoItem/indexItem";
import ValueItem from "./infoItem/valueItem";
import BeneficiaryItem from "./infoItem/beneficiaryItem";
import ProposerItem from "./infoItem/proposerItem";

export default function TreasuryProposalApprovedContent({
  proposalIndex,
  data,
}) {
  return (
    <>
      <IndexItem index={proposalIndex} baseUrl={treasuryProposalBaseUrl} />
      <ValueItem value={data.value} />
      <BeneficiaryItem beneficiary={data.beneficiary} />
      <ProposerItem proposer={data.proposer} />
    </>
  );
}
