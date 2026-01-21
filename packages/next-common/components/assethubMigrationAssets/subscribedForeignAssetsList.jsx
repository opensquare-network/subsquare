import { useMemo, useState, useEffect, useCallback } from "react";
import useSortedForeignAssetMetadata from "./useForeignAssetsWithBalances";
import { useTotalCounts } from "./context/assetHubTabsProvider";
import DynamicForeignAssetsTable from "./dynamicForeignAssetsTable";

export default function SubscribedForeignAssetsList({ address, columnsDef }) {
  const sortedMetadata = useSortedForeignAssetMetadata();
  const [, setTotalCount] = useTotalCounts();
  const [loadedAssets, setLoadedAssets] = useState({});

  const handleAssetLoaded = useCallback((assetId, hasBalance) => {
    setLoadedAssets((prev) => ({ ...prev, [assetId]: hasBalance }));
  }, []);

  const allAssetsLoaded = useMemo(() => {
    if (!sortedMetadata) {
      return false;
    }

    if (sortedMetadata.length === 0) {
      return true;
    }

    return sortedMetadata.every((asset) => asset.assetId in loadedAssets);
  }, [sortedMetadata, loadedAssets]);

  const assetsWithBalanceCount = useMemo(() => {
    return Object.values(loadedAssets).filter(Boolean).length;
  }, [loadedAssets]);

  const loading = !sortedMetadata || !allAssetsLoaded;

  useEffect(() => {
    if (allAssetsLoaded) {
      setTotalCount("assets", assetsWithBalanceCount);
    }
  }, [allAssetsLoaded, assetsWithBalanceCount, setTotalCount]);

  const showHiddenCollectors = loading || assetsWithBalanceCount === 0;

  return (
    <DynamicForeignAssetsTable
      assetsWithBalanceCount={assetsWithBalanceCount}
      assetsMetadata={sortedMetadata || []}
      address={address}
      columnsDef={columnsDef}
      loading={loading}
      onLoaded={handleAssetLoaded}
      showHiddenCollectors={showHiddenCollectors}
    />
  );
}
