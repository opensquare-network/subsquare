import { treasuryProposalBaseUrl } from "../../../../utils/postBaseUrl";
import IndexItem from "./infoItem/indexItem";

export default function treasuryProposalAwardedContent({
  proposalIndex,
  data,
}) {
  return (
    <>
      <IndexItem index={proposalIndex} baseUrl={treasuryProposalBaseUrl} />
    </>
  );
}
