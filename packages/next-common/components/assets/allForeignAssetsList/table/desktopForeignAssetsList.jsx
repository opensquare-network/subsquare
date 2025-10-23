import React from "react";
import ScrollerX from "next-common/components/styled/containers/scrollerX";
import { MapDataList } from "next-common/components/dataList";
import { useDesktopColumns } from "./columns";
import { useAllForeignAssetsContext } from "next-common/context/foreignAssets/allForeignAssets";

export default function DesktopForeignAssetsList({ assets }) {
  const { loading } = useAllForeignAssetsContext();
  const columnsDef = useDesktopColumns();

  return (
    <ScrollerX>
      <MapDataList
        columnsDef={columnsDef}
        data={assets}
        loading={loading}
        noDataText="No current foreign assets"
      />
    </ScrollerX>
  );
}
