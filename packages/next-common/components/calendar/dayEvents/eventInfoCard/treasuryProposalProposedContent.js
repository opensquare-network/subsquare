import React from "react";
import { treasuryProposalBaseUrl } from "../../../../utils/postBaseUrl";
import BeneficiaryItem from "./infoItem/beneficiaryItem";
import IndexItem from "./infoItem/indexItem";
import ProposerItem from "./infoItem/proposerItem";
import TitleItem from "./infoItem/titleItem";
import ValueItem from "./infoItem/valueItem";

export default function TreasuryProposalProposedContent({
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
