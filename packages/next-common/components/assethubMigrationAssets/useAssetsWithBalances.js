import { useMemo, useCallback, useState, useEffect } from "react";
import useAllAssetMetadata from "next-common/components/assethubMigrationAssets/context/assetMetadata";
import { useKnownAssetHubAssets } from "next-common/components/assethubMigrationAssets/known";
import useSubStorage from "next-common/hooks/common/useSubStorage";
import BigNumber from "bignumber.js";

function useSortedAssetMetadata() {
  const [allMetadata] = useAllAssetMetadata();
  const knownAssetDefs = useKnownAssetHubAssets();

  return useMemo(() => {
    if (!allMetadata) {
      return null;
    }

    const knownAssetIds = knownAssetDefs.map((def) => def.assetId);
    const knownAssets = knownAssetDefs.reduce((result, def) => {
      const find = allMetadata.find((asset) => asset.assetId === def.assetId);
      if (find) {
        return [...result, find];
      }
      return result;
    }, []);
    const otherAssets = allMetadata.filter(
      (asset) => !knownAssetIds.includes(asset.assetId),
    );

    return [...knownAssets, ...otherAssets];
  }, [allMetadata, knownAssetDefs]);
}

function BalanceCollector({ assetId, address, onUpdate }) {
  const { loading, result } = useSubStorage("assets", "account", [
    assetId,
    address,
  ]);

  useEffect(() => {
    if (loading) {
      onUpdate(assetId, { loading: true, balance: null, transferrable: null });
      return;
    }

    if (!result || result.isNone) {
      onUpdate(assetId, { loading: false, balance: null, transferrable: null });
      return;
    }

    const unwrapped = result.unwrap();
    const balance =
      unwrapped.balance?.toJSON?.() || unwrapped.balance?.toString() || "0";
    const isFrozen = unwrapped.status?.isFrozen;
    const transferrable = isFrozen ? "0" : balance;

    onUpdate(assetId, { loading: false, balance, transferrable });
  }, [assetId, loading, result, onUpdate]);

  return null;
}

export default function useAssetsWithBalances(address) {
  const sortedMetadata = useSortedAssetMetadata();
  const [balancesMap, setBalancesMap] = useState({});
  const [collectors, setCollectors] = useState(null);

  const handleUpdate = useCallback((assetId, data) => {
    setBalancesMap((prev) => {
      if (
        prev[assetId]?.loading === data.loading &&
        prev[assetId]?.balance === data.balance
      ) {
        return prev;
      }
      return { ...prev, [assetId]: data };
    });
  }, []);

  // Create collectors when metadata is ready
  useEffect(() => {
    if (!sortedMetadata || !address) {
      setCollectors(null);
      setBalancesMap({});
      return;
    }

    setCollectors(
      sortedMetadata.map((asset) => (
        <BalanceCollector
          key={asset.assetId}
          assetId={asset.assetId}
          address={address}
          onUpdate={handleUpdate}
        />
      )),
    );
  }, [sortedMetadata, address, handleUpdate]);

  // Compute loading state and final assets list
  const { loading, assets } = useMemo(() => {
    if (!sortedMetadata) {
      return { loading: true, assets: null };
    }

    const allAssetIds = sortedMetadata.map((a) => a.assetId);
    const allLoaded = allAssetIds.every(
      (id) => balancesMap[id] && !balancesMap[id].loading,
    );

    if (!allLoaded) {
      return { loading: true, assets: null };
    }

    // Filter assets with non-zero balance
    const assetsWithBalance = sortedMetadata
      .map((asset) => {
        const balanceData = balancesMap[asset.assetId];
        if (!balanceData?.balance || new BigNumber(balanceData.balance).isZero()) {
          return null;
        }
        return {
          ...asset,
          balance: balanceData.balance,
          transferrable: balanceData.transferrable,
        };
      })
      .filter(Boolean);

    return { loading: false, assets: assetsWithBalance };
  }, [sortedMetadata, balancesMap]);

  return { loading, assets, collectors };
}
