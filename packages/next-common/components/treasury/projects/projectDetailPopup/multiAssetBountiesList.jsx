import ProjectItemsList from "./itemsList";
import { multiAssetBountyColumnsDef } from "./columns";

export default function ProjectMultiAssetBountiesList({
  bounties = [],
  loading = false,
}) {
  return (
    <ProjectItemsList
      items={bounties}
      loading={loading}
      columnsDef={multiAssetBountyColumnsDef}
      noDataText="No multi-asset bounties"
    />
  );
}
