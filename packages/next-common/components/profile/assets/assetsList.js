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
import useAssetHubAccountAssets from "next-common/components/assets/useAssetHubAccountAssets";
import { usePageProps } from "next-common/context/page";
import useRealAddress from "next-common/utils/hooks/useRealAddress";

const columnsDef = [colToken, colId, colName, colTotal, colTransferrable];

export default function ProfileAssetsList() {
  const { id } = usePageProps();
  const myAddress = useRealAddress();
  const address = id || myAddress;
  const assets = useAssetHubAccountAssets(address);

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
