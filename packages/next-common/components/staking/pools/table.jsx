import TreeMapDataList from "next-common/components/dataList/treeList";
import usePoolsColumns from "./hooks/usePoolsColumns";

export default function PoolsTableList({ list = [], loading = false }) {
  const columns = usePoolsColumns();

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
