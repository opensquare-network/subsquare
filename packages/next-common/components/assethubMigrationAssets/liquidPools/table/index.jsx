import ScrollerX from "next-common/components/styled/containers/scrollerX";
import { MapDataList } from "next-common/components/dataList";

export default function LiquidPoolsTable({ pools, loading, columnsDef }) {
  return (
    <ScrollerX>
      <MapDataList
        columnsDef={columnsDef}
        data={pools}
        getRowKey={(pool) => pool.poolAssetId}
        loading={loading}
        noDataText="No liquid pools"
      />
    </ScrollerX>
  );
}
