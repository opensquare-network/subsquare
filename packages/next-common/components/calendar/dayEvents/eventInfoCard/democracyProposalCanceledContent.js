import { democracyProposalBaseUrl } from "../../../../utils/postBaseUrl";
import IndexItem from "./infoItem/indexItem";

export default function DemocracyProposalCanceledContent({ proposalIndex }) {
  return <IndexItem index={proposalIndex} baseUrl={democracyProposalBaseUrl} />;
}
