import React from "react";
import ScrollerX from "next-common/components/styled/containers/scrollerX";
import { MapDataList } from "next-common/components/dataList";

export default function DynamicAssetsTable({
  assets,
  columnsDef,
  loading,
  noDataText = "No current assets",
}) {
  return (
    <ScrollerX>
      <MapDataList
        columnsDef={columnsDef}
        data={assets}
        getRowKey={(asset) => asset.assetId}
        loading={loading}
        noDataText={noDataText}
      />
    </ScrollerX>
  );
}
