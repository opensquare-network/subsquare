import React from "react";
import { useForeignAssets } from "next-common/context/foreignAssets";
import ScrollerX from "next-common/components/styled/containers/scrollerX";
import { MapDataList } from "next-common/components/dataList";
import { foreignAssetsColumnsDef } from "./columns";

export default function ForeignAssetsTable() {
  const { assets, loading } = useForeignAssets();

  return (
    <ScrollerX>
      <MapDataList
        columnsDef={foreignAssetsColumnsDef}
        data={assets}
        loading={loading}
        noDataText="No current foreign assets"
      />
    </ScrollerX>
  );
}
