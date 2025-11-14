import { MapDataList } from "next-common/components/dataList";
import { proposalColumnsDef } from "./columns";

export default function ProjectProposalsList({
  proposals = [],
  loading = false,
}) {
  return (
    <MapDataList
      noDataText="No proposals"
      loading={loading}
      data={proposals}
      columnsDef={proposalColumnsDef}
    />
  );
}
