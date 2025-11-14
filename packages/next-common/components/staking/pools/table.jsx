import DataList from "next-common/components/dataList";
import usePoolsColumns from "./hooks/usePoolsColumns";
import { useMemo } from "react";
import { MineTagOnListView } from "next-common/components/delegation/delegate/common/mineTag";
import { useMyPool } from "next-common/context/staking/myPool";

export default function PoolsTableList({ list = [], loading = false }) {
  const { poolMember } = useMyPool();
  const columns = usePoolsColumns();
  const myPoolId = poolMember?.poolId;

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
