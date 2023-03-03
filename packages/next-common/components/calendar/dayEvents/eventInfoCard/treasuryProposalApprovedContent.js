import { treasuryProposalBaseUrl } from "../../../../utils/postBaseUrl";
import IndexItem from "./infoItem/indexItem";

export default function TreasuryProposalApprovedContent({
  proposalIndex,
  data,
}) {
  return (
    <>
      <IndexItem index={proposalIndex} baseUrl={treasuryProposalBaseUrl} />
    </>
  );
}
