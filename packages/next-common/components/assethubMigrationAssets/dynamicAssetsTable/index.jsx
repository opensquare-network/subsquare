import React from "react";
import { SystemLoading } from "@osn/icons/subsquare";
import ScrollerX from "next-common/components/styled/containers/scrollerX";
import NoData from "next-common/components/noData";
import AssetsHeader from "./assetsHeader";
import AssetRowItem from "./assetRowItem";
import useColumnStyles from "./useColumnStyles";

export default function DynamicAssetsTable({
  assetsWithBalanceCount,
  assetsMetadata,
  address,
  columnsDef,
  loading,
  noDataText = "No current assets",
  onLoaded,
  showHiddenCollectors = false,
}) {
  const { classNames, styles } = useColumnStyles(columnsDef);

  let content;
  if (loading) {
    content = (
      <SystemLoading className="w-5 h-5 mt-4 mb-2 mx-auto [&_path]:stroke-textDisabled" />
    );
  } else if (assetsWithBalanceCount === 0) {
    content = <NoData showIcon={false} text={noDataText} />;
  } else {
    content = (
      <div className="datalist-body divide-y divide-neutral300 border-b border-neutral300">
        {assetsMetadata.map((asset) => (
          <AssetRowItem
            key={asset.assetId}
            asset={asset}
            address={address}
            columnsDef={columnsDef}
            classNames={classNames}
            styles={styles}
            onLoaded={onLoaded}
          />
        ))}
      </div>
    );
  }

  return (
    <ScrollerX>
      <div className="datalist w-full text-textPrimary bg-neutral100">
        <AssetsHeader
          columnsDef={columnsDef}
          classNames={classNames}
          styles={styles}
        />
        {content}
      </div>
      {showHiddenCollectors && assetsMetadata && (
        <div className="hidden">
          {assetsMetadata.map((asset) => (
            <AssetRowItem
              key={asset.assetId}
              asset={asset}
              address={address}
              columnsDef={columnsDef}
              classNames={classNames}
              styles={styles}
              onLoaded={onLoaded}
            />
          ))}
        </div>
      )}
    </ScrollerX>
  );
}
