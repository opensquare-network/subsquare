import { useEffect, useState, useCallback, useRef } from "react";
import { useAssetHubApi } from "next-common/hooks/chain/useAssetHubApi";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import useChainOrScanHeight from "next-common/hooks/height";
import { isEqual } from "lodash-es";

async function queryForeignAssetAccount(api, assetLocation, realAddress) {
  const accountInfo = await api.query.foreignAssets.account(
    assetLocation,
    realAddress,
  );

  if (!accountInfo.isSome) {
    return null;
  }

  const unwrapped = accountInfo.unwrap();
  return {
    unwrapped,
    balance: unwrapped?.balance?.toBigInt(),
    isFrozen: unwrapped?.status?.isFrozen,
  };
}

async function queryFreignAssetMetadata(api, assetLocation) {
  try {
    const metadata = await api.query.foreignAssets.metadata(assetLocation);

    return {
      decimals: metadata?.decimals?.toNumber(),
      name: metadata?.name?.toHuman(),
      symbol: metadata?.symbol?.toHuman(),
    };
  } catch (error) {
    console.error(
      `Failed to query metadata for asset ${assetLocation.toString()}`,
    );
  }
}

async function queryMyForeignAsset(api, key, realAddress) {
  const assetLocation = key.args[0];
  if (!assetLocation || !assetLocation?.hash) {
    return null;
  }

  const assetId = assetLocation?.hash?.toString();
  try {
    const accountInfo = await queryForeignAssetAccount(
      api,
      assetLocation,
      realAddress,
    );

    if (!accountInfo || accountInfo.balance <= 0n) {
      return null;
    }

    const metadata = await queryFreignAssetMetadata(api, assetLocation);

    const balance = accountInfo.balance.toString();
    const isFrozen = accountInfo.isFrozen;
    const transferable = isFrozen ? "0" : balance;

    return {
      assetId,
      balance,
      location: assetLocation.toJSON(),
      isFrozen,
      transferable,
      decimals: metadata?.decimals,
      name: metadata?.name,
      symbol: metadata?.symbol,
    };
  } catch (error) {
    console.error(`Failed to query asset ${assetLocation.toString()}:`, error);
    return null;
  }
}

async function fetchForeignAssets(api, realAddress) {
  try {
    const assetEntries = await api.query.foreignAssets.asset.entries();

    const userAssets = [];
    for (const [key] of assetEntries) {
      const assetData = await queryMyForeignAsset(api, key, realAddress);
      if (assetData) {
        userAssets.push(assetData);
      }
    }

    return userAssets;
  } catch (error) {
    console.error("Failed to fetch foreign assets:", error);
    throw error;
  }
}

export default function useMyForeignAssets() {
  const api = useAssetHubApi();
  const realAddress = useRealAddress();
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const blockHeight = useChainOrScanHeight();
  const prevAssetsRef = useRef([]);

  const fetchData = useCallback(async () => {
    try {
      const userAssets = await fetchForeignAssets(api, realAddress);
      if (isEqual(prevAssetsRef.current, userAssets)) {
        return;
      }

      prevAssetsRef.current = userAssets;
      setAssets(userAssets);
    } catch (error) {
      setAssets([]);
    } finally {
      setLoading(false);
    }
  }, [api, realAddress]);

  useEffect(() => {
    if (!api || !realAddress) {
      return;
    }

    fetchData();
  }, [api, realAddress, fetchData, blockHeight]);

  return { assets, loading };
}
