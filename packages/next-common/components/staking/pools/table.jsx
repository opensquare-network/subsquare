import DataList from "next-common/components/dataList";
import usePoolsColumns from "./hooks/usePoolsColumns";
import { useMemo } from "react";
import { MineTagOnListView } from "next-common/components/delegation/delegate/common/mineTag";

export default function PoolsTableList({
  myPoolId,
  list = [],
  loading = false,
}) {
  const columns = usePoolsColumns();

  const rows = useMemo(
    () =>
      list.map((item) => {
        const row = columns.map((column) => column?.render?.(item));
        if (myPoolId && Number(item.poolId) === Number(myPoolId)) {
          row.tag = <MineTagOnListView />;
        }
        return row;
      }),
    [list, columns, myPoolId],
  );

  return (
    <DataList
      className="pl-6"
      columns={columns}
      rows={rows}
      loading={loading}
      noDataText="No current pools"
    />
  );
}
