import { useMemo, useState, useEffect, useCallback } from "react";
import useSortedAssetMetadata from "./useAssetsWithBalances";
import { useTotalCounts } from "./context/assetHubTabsProvider";
import DynamicAssetsTable from "./dynamicAssetsTable";

export default function SubscribedAssetsList({ address, columnsDef }) {
  const sortedMetadata = useSortedAssetMetadata();
  const [, setTotalCount] = useTotalCounts();
  const [loadedAssets, setLoadedAssets] = useState({});

  const handleAssetLoaded = useCallback((assetId, hasBalance) => {
    setLoadedAssets((prev) => ({ ...prev, [assetId]: hasBalance }));
  }, []);

  const allAssetsLoaded = useMemo(() => {
    if (!sortedMetadata || sortedMetadata.length === 0) {
      return false;
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
    <DynamicAssetsTable
      assetsMetadata={sortedMetadata}
      assetsWithBalanceCount={assetsWithBalanceCount}
      address={address}
      columnsDef={columnsDef}
      loading={loading}
      onLoaded={handleAssetLoaded}
      showHiddenCollectors={showHiddenCollectors}
    />
  );
}
