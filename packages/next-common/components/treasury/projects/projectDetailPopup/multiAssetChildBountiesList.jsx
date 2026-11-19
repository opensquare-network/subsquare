import ProjectItemsList from "./itemsList";
import { multiAssetChildBountyColumnsDef } from "./columns";

export default function ProjectMultiAssetChildBountiesList({
  childBounties = [],
  loading = false,
}) {
  return (
    <ProjectItemsList
      items={childBounties}
      loading={loading}
      columnsDef={multiAssetChildBountyColumnsDef}
      noDataText="No multi-asset child bounties"
    />
  );
}
