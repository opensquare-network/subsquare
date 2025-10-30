import TreeMapDataList from "next-common/components/dataList/treeList";
import columns from "./columns";

export default function PoolsTableList({ list = [], loading = false }) {
  return (
    <TreeMapDataList
      getRowKey={(row) => row.poolId}
      columnsDef={columns}
      data={list}
      loading={loading}
      noDataText="No current pools"
      treeKey="roles"
    />
  );
}
