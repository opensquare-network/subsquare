import ProjectItemsList from "./itemsList";
import { proposalColumnsDef } from "./columns";

export default function ProjectProposalsList({
  proposals = [],
  loading = false,
}) {
  return (
    <ProjectItemsList
      items={proposals}
      loading={loading}
      columnsDef={proposalColumnsDef}
      noDataText="No proposals"
    />
  );
}
