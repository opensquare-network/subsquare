import React from "react";
import ScrollerX from "next-common/components/styled/containers/scrollerX";
import { MapDataList } from "next-common/components/dataList";
import {
  colId,
  colName,
  colToken,
  useColTotal,
  useColTransferrable,
} from "next-common/components/assets/common/columns";
import { useQueryAddressAssets } from "next-common/components/assets/useSubAssetBalance";

export default function ProfileAssetsList({ address }) {
  const { loading, assets } = useQueryAddressAssets(address);
  const colTotal = useColTotal(address);
  const colTransferrable = useColTransferrable(address);

  const columnsDef = [colToken, colId, colName, colTotal, colTransferrable];

  return (
    <ScrollerX>
      <MapDataList
        columnsDef={columnsDef}
        data={assets}
        loading={loading}
        noDataText="No current assets"
      />
    </ScrollerX>
  );
}
