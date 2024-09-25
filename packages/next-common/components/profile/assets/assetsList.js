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
import useAssetHubTabsAssets from "next-common/components/assets/useAssetHubTabsAssets";
import useAccountAddress from "next-common/utils/hooks/useAccountAddress";

const columnsDef = [colToken, colId, colName, colTotal, colTransferrable];

export default function ProfileAssetsList() {
  const address = useAccountAddress();
  const assets = useAssetHubTabsAssets(address);

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
