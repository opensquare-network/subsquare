import { MapDataList } from "next-common/components/dataList";
import { childBountyColumnsDef } from "./columns";

export default function ProjectChildBountiesList({
  childBounties = [],
  loading = false,
}) {
  return (
    <MapDataList
      noDataText="No child bounties"
      loading={loading}
      data={childBounties}
      columnsDef={childBountyColumnsDef}
    />
  );
}
