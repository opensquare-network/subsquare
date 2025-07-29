import { useEffect, useState } from "react";
import { useAssetHubApi } from "next-common/hooks/chain/useAssetHubApi";
import useRealAddress from "next-common/utils/hooks/useRealAddress";

async function getForeignAssetEntries(api) {
  const assetEntries = await api.query.foreignAssets.asset.entries();
  return assetEntries;
}

async function queryUserAssetAccount(api, assetLocation, realAddress) {
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

async function queryAssetDetails(api, assetLocation) {
  const assetRaw = await api.query.foreignAssets.asset(assetLocation);
  if (!assetRaw.isSome) {
    return null;
  }

  const unwrapped = assetRaw.unwrap();
  return {
    supply: unwrapped.supply.toString(),
    ...unwrapped.toJSON(),
  };
}

async function processUserAssetData(api, key, realAddress) {
  const assetLocation = key.args[0];
  const assetId = assetLocation.hash.toString();

  try {
    const accountInfo = await queryUserAssetAccount(
      api,
      assetLocation,
      realAddress,
    );

    if (!accountInfo || accountInfo.balance <= 0n) {
      return null;
    }

    const assetDetail = await queryAssetDetails(api, assetLocation);
    return {
      ...accountInfo.unwrapped.toJSON(),
      assetId,
      balance: accountInfo.balance.toString(),
      location: assetLocation.toJSON(),
      isFrozen: accountInfo.isFrozen,
      supply: assetDetail?.supply,
    };
  } catch (error) {
    console.warn(`Failed to query asset ${assetLocation.toString()}:`, error);
    return null;
  }
}

async function fetchUserForeignAssets(api, realAddress) {
  try {
    const assetEntries = await getForeignAssetEntries(api);

    const userAssets = [];
    for (const [key] of assetEntries) {
      const assetData = await processUserAssetData(api, key, realAddress);
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

  useEffect(() => {
    if (!api || !realAddress) {
      return;
    }

    const loadAssets = async () => {
      try {
        setLoading(true);
        const userAssets = await fetchUserForeignAssets(api, realAddress);
        setAssets(userAssets);
      } catch (error) {
        setAssets([]);
      } finally {
        setLoading(false);
      }
    };

    loadAssets();
  }, [api, realAddress]);

  return { assets, loading };
}
