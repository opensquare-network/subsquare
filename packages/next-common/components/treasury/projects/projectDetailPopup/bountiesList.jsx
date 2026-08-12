import ProjectItemsList from "./itemsList";
import { bountyColumnsDef } from "./columns";

export default function ProjectBountiesList({ bounties = [], loading = false }) {
  return (
    <ProjectItemsList
      items={bounties}
      loading={loading}
      columnsDef={bountyColumnsDef}
      noDataText="No bounties"
    />
  );
}
