import { useEffect, useState, useCallback, useRef } from "react";
import { useAssetHubApi } from "next-common/hooks/chain/useAssetHubApi";
import useChainOrScanHeight from "next-common/hooks/height";
import { isEqual } from "lodash-es";

async function queryForeignAssetAccount(api, assetLocation, address) {
  const accountInfo = await api.query.foreignAssets.account(
    assetLocation,
    address,
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

async function queryMyForeignAsset(api, key, address) {
  const assetLocation = key.args[0];
  if (!assetLocation || !assetLocation?.hash) {
    return null;
  }

  const assetId = assetLocation?.hash?.toString();
  try {
    const accountInfo = await queryForeignAssetAccount(
      api,
      assetLocation,
      address,
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

async function fetchForeignAssets(api, address) {
  try {
    const assetEntries = await api.query.foreignAssets.asset.entries();

    const userAssets = [];
    for (const [key] of assetEntries) {
      const assetData = await queryMyForeignAsset(api, key, address);
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

export default function useForeignAssets(address) {
  const api = useAssetHubApi();
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const blockHeight = useChainOrScanHeight();
  const prevAssetsRef = useRef([]);

  const fetchData = useCallback(async () => {
    try {
      const userAssets = await fetchForeignAssets(api, address);
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
  }, [api, address]);

  useEffect(() => {
    if (!api || !address) {
      return;
    }

    fetchData();
  }, [api, address, fetchData, blockHeight]);

  return { assets, loading };
}
