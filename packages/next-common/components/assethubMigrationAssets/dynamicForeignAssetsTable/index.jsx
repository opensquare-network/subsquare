import React from "react";
import { SystemLoading } from "@osn/icons/subsquare";
import ScrollerX from "next-common/components/styled/containers/scrollerX";
import NoData from "next-common/components/noData";
import AssetsHeader from "../dynamicAssetsTable/assetsHeader";
import ForeignAssetRowItem from "./foreignAssetRowItem";
import useColumnStyles from "../dynamicAssetsTable/useColumnStyles";

export default function DynamicForeignAssetsTable({
  assets,
  columnsDef,
  loading,
  noDataText = "No current foreign assets",
}) {
  const { classNames, styles } = useColumnStyles(columnsDef);

  let content;
  if (loading) {
    content = (
      <SystemLoading className="w-5 h-5 mt-4 mb-2 mx-auto [&_path]:stroke-textDisabled" />
    );
  } else if (assets.length === 0) {
    content = <NoData showIcon={false} text={noDataText} />;
  } else {
    content = (
      <div className="datalist-body divide-y divide-neutral300 border-b border-neutral300">
        {assets.map((asset) => (
          <ForeignAssetRowItem
            key={asset.assetId}
            asset={asset}
            columnsDef={columnsDef}
            classNames={classNames}
            styles={styles}
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
    </ScrollerX>
  );
}
