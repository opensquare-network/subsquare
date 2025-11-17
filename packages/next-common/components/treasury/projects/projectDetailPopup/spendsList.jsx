import { MapDataList } from "next-common/components/dataList";
import { spendColumnsDef } from "./columns";

export default function ProjectSpendsList({ spends = [], loading = false }) {
  return (
    <MapDataList
      loading={loading}
      data={spends}
      columnsDef={spendColumnsDef}
      noDataText="No spends"
    />
  );
}
