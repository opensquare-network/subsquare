import React from "react";
import ScrollerX from "next-common/components/styled/containers/scrollerX";
import { MapDataList } from "next-common/components/dataList";
import { mobileColumns } from "./columns";

export default function MobileForeignAssetsList({ assets }) {
  return (
    <ScrollerX>
      <MapDataList
        columnsDef={mobileColumns}
        data={assets}
        loading={!assets}
        noDataText="No current foreign assets"
      />
    </ScrollerX>
  );
}
