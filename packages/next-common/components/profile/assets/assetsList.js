import React from "react";
import ScrollerX from "next-common/components/styled/containers/scrollerX";
import { MapDataList } from "next-common/components/dataList";
import {
  colId,
  colName,
  colToken,
  colTotal,
  colTransferrable,
} from "next-common/components/assets/assetsList";
import { useAssets } from "next-common/components/assets/context/assetHubTabsProvider";

const columnsDef = [colToken, colId, colName, colTotal, colTransferrable];

export default function ProfileAssetsList() {
  const assets = useAssets();

  return (
    <ScrollerX>
      <MapDataList
        columnsDef={columnsDef}
        data={assets}
        loading={!assets}
        noDataText="No current assets"
      />
    </ScrollerX>
  );
}
