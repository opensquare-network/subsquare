import React from "react";
import ScrollerX from "next-common/components/styled/containers/scrollerX";
import { MapDataList } from "next-common/components/dataList";
import { useDesktopColumns } from "./columns";

export default function DesktopForeignAssetsList({ assets }) {
  const columnsDef = useDesktopColumns();

  return (
    <ScrollerX>
      <MapDataList
        columnsDef={columnsDef}
        data={assets}
        loading={!assets}
        noDataText="No current foreign assets"
      />
    </ScrollerX>
  );
}
