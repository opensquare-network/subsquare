import React, { useMemo, useState, useEffect, useCallback } from "react";
import { SystemLoading } from "@osn/icons/subsquare";
import ScrollerX from "next-common/components/styled/containers/scrollerX";
import useSortedAssetMetadata from "./useAssetsWithBalances";
import { useTotalCounts } from "./context/assetHubTabsProvider";
import { cn } from "next-common/utils";
import { isNil, last } from "lodash-es";
import { useNavCollapsed } from "next-common/context/nav";
import useIsNarrowView from "next-common/hooks/useIsNarrowView";
import Descriptions from "next-common/components/Descriptions";
import AssetRow from "./assetRow";
import NoData from "next-common/components/noData";

function useColumnStyles(columnsDef) {
  return useMemo(() => {
    const classNames = columnsDef.map((col) =>
      cn(
        "text14Medium",
        !col.className
          ?.split(" ")
          ?.some((className) => className.startsWith("w-")) &&
          !col?.style?.width &&
          !col?.width &&
          "flex-1 w-full",
        col.className,
      ),
    );

    const styles = columnsDef.map((col) => ({
      ...col.style,
      ...(!isNil(col.width)
        ? {
            width: col.width,
            minWidth: col.width,
          }
        : {}),
    }));

    return { classNames, styles };
  }, [columnsDef]);
}

function AssetsListHeader({ columnsDef, classNames, styles }) {
  const [navCollapsed] = useNavCollapsed();

  return (
    <div
      className={cn(
        "datalist-head flex items-center pb-3 border-b border-neutral300",
        navCollapsed ? "max-sm:hidden" : "max-md:hidden",
      )}
    >
      {columnsDef.map((col, idx) => (
        <div
          key={idx}
          className={cn("text-textTertiary", classNames[idx])}
          style={styles[idx]}
        >
          {col.name}
        </div>
      ))}
    </div>
  );
}

function DesktopAssetRow({ asset, columnsDef, classNames, styles }) {
  return (
    <div className="datalist-desktop-item w-full flex items-center">
      {columnsDef.map((col, idx) => (
        <div key={idx} className={classNames[idx]} style={styles[idx]}>
          {col.render(asset)}
        </div>
      ))}
    </div>
  );
}

function MobileAssetRow({ asset, columnsDef }) {
  const [navCollapsed] = useNavCollapsed();

  const items = columnsDef.map((col) => ({
    name: col.name,
    value: col.render(asset),
  }));

  const hasAction = last(items).name === "";
  const actionIdx = hasAction ? items.length - 1 : -1;
  const action = items[actionIdx];

  const restItems = items.filter((_, idx) => idx !== actionIdx);
  const [first, ...rest] = restItems;

  const descriptionItems = rest
    .map((item) => {
      return (
        !isNil(item?.value) && {
          label: <span className="text-textTertiary">{item.name}</span>,
          value: item.value,
          className: "h-auto mt-2 items-start",
        }
      );
    })
    .filter(Boolean);

  return (
    <div
      className={cn(
        "datalist-mobile-item space-y-3",
        navCollapsed ? "sm:py-4" : "md:py-4",
      )}
    >
      <div>
        <div className="flex grow items-center justify-between">
          {first.value}
          {action && items[actionIdx]?.value}
        </div>
      </div>
      <Descriptions bordered={false} items={descriptionItems} />
    </div>
  );
}

function AssetRowItem({
  asset,
  address,
  columnsDef,
  classNames,
  styles,
  onLoaded,
}) {
  const [navCollapsed] = useNavCollapsed();
  const isNarrowView = useIsNarrowView();

  return (
    <AssetRow asset={asset} address={address} onLoaded={onLoaded}>
      {(assetWithBalance) => (
        <div
          className={cn(
            "datalist-item w-full flex items-center py-4",
            navCollapsed ? "max-sm:block" : "max-md:block",
          )}
        >
          {isNarrowView ? (
            <MobileAssetRow asset={assetWithBalance} columnsDef={columnsDef} />
          ) : (
            <DesktopAssetRow
              asset={assetWithBalance}
              columnsDef={columnsDef}
              classNames={classNames}
              styles={styles}
            />
          )}
        </div>
      )}
    </AssetRow>
  );
}

export default function SubscribedAssetsList({ address, columnsDef }) {
  const sortedMetadata = useSortedAssetMetadata();
  const [, setTotalCount] = useTotalCounts();
  const { classNames, styles } = useColumnStyles(columnsDef);
  const [loadedAssets, setLoadedAssets] = useState({});

  const handleAssetLoaded = useCallback((assetId, hasBalance) => {
    setLoadedAssets((prev) => ({ ...prev, [assetId]: hasBalance }));
  }, []);

  // Check if all assets have been loaded
  const allAssetsLoaded = useMemo(() => {
    if (!sortedMetadata || sortedMetadata.length === 0) {
      return false;
    }
    return sortedMetadata.every((asset) => asset.assetId in loadedAssets);
  }, [sortedMetadata, loadedAssets]);

  // Count assets with balance
  const assetsWithBalanceCount = useMemo(() => {
    return Object.values(loadedAssets).filter(Boolean).length;
  }, [loadedAssets]);

  // Loading state: metadata not ready OR not all assets loaded yet
  const loading = !sortedMetadata || !allAssetsLoaded;

  // Update total count when all assets are loaded
  useEffect(() => {
    if (allAssetsLoaded) {
      setTotalCount("assets", assetsWithBalanceCount);
    }
  }, [allAssetsLoaded, assetsWithBalanceCount, setTotalCount]);

  // Render content based on loading state
  let content;
  if (loading) {
    content = (
      <SystemLoading className="w-5 h-5 mt-4 mb-2 mx-auto [&_path]:stroke-textDisabled" />
    );
  } else if (assetsWithBalanceCount === 0) {
    content = <NoData showIcon={false} text="No current assets" />;
  } else {
    content = (
      <div className="datalist-body divide-y divide-neutral300 border-b border-neutral300">
        {sortedMetadata.map((asset) => (
          <AssetRowItem
            key={asset.assetId}
            asset={asset}
            address={address}
            columnsDef={columnsDef}
            classNames={classNames}
            styles={styles}
            onLoaded={handleAssetLoaded}
          />
        ))}
      </div>
    );
  }

  return (
    <ScrollerX>
      <div className="datalist w-full text-textPrimary bg-neutral100">
        <AssetsListHeader
          columnsDef={columnsDef}
          classNames={classNames}
          styles={styles}
        />
        {content}
      </div>
      {!allAssetsLoaded && sortedMetadata && (
        <div className="hidden">
          {sortedMetadata.map((asset) => (
            <AssetRowItem
              key={asset.assetId}
              asset={asset}
              address={address}
              columnsDef={columnsDef}
              classNames={classNames}
              styles={styles}
              onLoaded={handleAssetLoaded}
            />
          ))}
        </div>
      )}
    </ScrollerX>
  );
}
