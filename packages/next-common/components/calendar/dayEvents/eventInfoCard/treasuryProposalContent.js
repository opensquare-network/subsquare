import { treasuryProposalBaseUrl } from "../../../../utils/postBaseUrl";
import BeneficiaryItem from "./infoItem/beneficiaryItem";
import IndexItem from "./infoItem/indexItem";
import ProposerItem from "./infoItem/proposerItem";
import ValueItem from "./infoItem/valueItem";

export default function treasuryProposalContent({ proposalIndex, data }) {
  return (
    <>
      <IndexItem index={proposalIndex} baseUrl={treasuryProposalBaseUrl} />
      <ValueItem value={data.value} />
      <BeneficiaryItem beneficiary={data.beneficiary} />
      <ProposerItem proposer={data.proposer} />
    </>
  );
}
