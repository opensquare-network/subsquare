import { useMemo } from "react";
import DataList from "../../dataList";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import columns from "./columns";
import PoolNameColumn from "./columns/poolName";
import StatusColumn from "./columns/status";

export default function PoolsTableList({ list = [], loading = false }) {
  const { symbol, decimals } = useChainSettings();
  const rows = useMemo(() => {
    return list.map((row) => [
      <PoolNameColumn key={row.poolId} poolId={row.poolId} />,
      <div key={row.totalBonded}>
        <ValueDisplay
          value={toPrecision(row.value.points, decimals)}
          symbol={symbol}
        />
      </div>,
      // <div key={row.nominated}>{row.value.commission?.current ?? 0}</div>,
      <div key={row.members}>{row.value.memberCounter}</div>,
      <StatusColumn key={row.state} status={row.value.state} />,
    ]);
  }, [list, decimals, symbol]);

  return (
    <DataList
      rows={rows}
      loading={loading}
      columns={columns}
      getRowKey={(row) => row.poolId}
      noDataText="No pools"
    />
  );
}
