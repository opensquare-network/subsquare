import React from "react";
import { useMyForeignAssetsContext } from "next-common/context/foreignAssets";
import ScrollerX from "next-common/components/styled/containers/scrollerX";
import { MapDataList } from "next-common/components/dataList";
import { foreignAssetsColumnsDef } from "./columns/index";
import { SingleForeignAssetProvider } from "next-common/context/foreignAssets/singleForeignAsset";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";

function ForeignAssetListItem({ DataListItem, idx, rows, assets, loading }) {
  if (loading) {
    return null;
  }

  return (
    <SingleForeignAssetProvider assetLocation={assets[idx]?.location}>
      <DataListItem row={rows[idx]} />
    </SingleForeignAssetProvider>
  );
}

export default function ForeignAssetsTable() {
  const { assets, loading } = useMyForeignAssetsContext();

  const renderItem = (DataListItem, idx, rows) => (
    <ForeignAssetListItem
      DataListItem={DataListItem}
      idx={idx}
      rows={rows}
      assets={assets}
      loading={loading}
      key={assets[idx]?.assetId}
    />
  );

  return (
    <SecondaryCard>
      <ScrollerX>
        <MapDataList
          columnsDef={foreignAssetsColumnsDef}
          data={assets}
          loading={loading}
          renderItem={renderItem}
          noDataText="No current foreign assets"
        />
      </ScrollerX>
    </SecondaryCard>
  );
}
