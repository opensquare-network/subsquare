import React from "react";
import ScrollerX from "next-common/components/styled/containers/scrollerX";
import { MapDataList } from "next-common/components/dataList";
import { mobileColumns } from "./columns";
import { useAllForeignAssetsContext } from "next-common/context/foreignAssets/allForeignAssets";

export default function MobileForeignAssetsList({ assets }) {
  const { loading } = useAllForeignAssetsContext();

  return (
    <ScrollerX>
      <MapDataList
        columnsDef={mobileColumns}
        data={assets}
        loading={loading}
        noDataText="No current foreign assets"
      />
    </ScrollerX>
  );
}
