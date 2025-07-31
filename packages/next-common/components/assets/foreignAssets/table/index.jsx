import React from "react";
import { useForeignAssets } from "next-common/context/foreignAssets";
import ScrollerX from "next-common/components/styled/containers/scrollerX";
import DataList from "next-common/components/dataList";
import { foreignAssetsColumnsDef } from "./columns/index";
import { SingleForeignAssetProvider } from "next-common/context/foreignAssets/singleForeignAsset";

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
  const { assets, loading } = useForeignAssets();

  const columns = foreignAssetsColumnsDef.map((col) => ({
    name: col.name,
    style: col.style,
    className: col.className,
  }));

  const rows = (assets || []).map((item, index) => {
    const row = foreignAssetsColumnsDef.map(({ render }) => render(item));
    row.key = item.assetId || index;
    return row;
  });

  const renderItem = (DataListItem, idx, rows) => (
    <ForeignAssetListItem
      DataListItem={DataListItem}
      idx={idx}
      rows={rows}
      assets={assets}
      loading={loading}
      key={idx}
    />
  );

  return (
    <ScrollerX>
      <DataList
        columns={columns}
        rows={rows}
        loading={loading}
        renderItem={renderItem}
        noDataText="No current foreign assets"
      />
    </ScrollerX>
  );
}
