import ProjectItemsList from "./itemsList";
import { childBountyColumnsDef } from "./columns";

export default function ProjectChildBountiesList({
  childBounties = [],
  loading = false,
}) {
  return (
    <ProjectItemsList
      items={childBounties}
      loading={loading}
      columnsDef={childBountyColumnsDef}
      noDataText="No child bounties"
    />
  );
}
