import { useCallback, useState, useEffect, useMemo } from "react";
import {
  NATIVE_ASSET_ID,
  HUB_ID,
  bannedAssets,
  ASSETHUB_ID_BLACKLIST,
} from "../utils/constants";
import {
  fallbackAsset,
  fetchShareTokens,
  external,
  getFullAsset,
} from "../utils/assetUtils";
import {
  useHydrationSDK,
  useHydrationApi,
} from "next-common/hooks/ecoAssets/hydration/context/hydrationSDKContext";

export default function useAllAssets() {
  const sdk = useHydrationSDK();
  const api = useHydrationApi();
  const { client } = sdk ?? {};
  const [allAssets, setAllAssets] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAllAssets = useCallback(async () => {
    if (!client || !api) {
      return;
    }

    setLoading(true);
    try {
      const assets = await client.asset.getOnChainAssets(true, external);
      const shareTokensRaw = await fetchShareTokens(api);
      const allAssets = assets.reduce(
        (acc, assetRaw) => {
          if (bannedAssets.includes(assetRaw.id)) return acc;

          const asset = {
            ...getFullAsset(assetRaw),
          };

          if (
            asset?.externalId &&
            ASSETHUB_ID_BLACKLIST.includes(asset.externalId)
          ) {
            return acc;
          }

          acc.all.set(asset.id, asset);

          if (asset.id === NATIVE_ASSET_ID) {
            acc.native = asset;
          }

          if (asset.id === HUB_ID) {
            acc.hub = asset;
          }

          return acc;
        },
        {
          all: new Map([]),
          native: {},
          hub: {},
        },
      );

      const { shareTokens, shareTokensMap } = shareTokensRaw.reduce(
        (acc, token) => {
          const { shareTokenId, poolAddress, assets } = token;

          const existingShareToken = allAssets.all.get(shareTokenId);

          let tokenFull;
          if (existingShareToken) {
            tokenFull = {
              ...existingShareToken,
              poolAddress,
              assets: assets
                .map((assetId) => allAssets.all.get(assetId))
                .filter(Boolean),
              isShareToken: true,
            };
          } else {
            const assetA = allAssets.all.get(assets[0]);
            const assetB = allAssets.all.get(assets[1]);

            if (assetA && assetB && assetA.symbol && assetB.symbol) {
              const assetDecimal =
                Number(assetA.id) > Number(assetB.id) ? assetB : assetA;
              const decimals = assetDecimal.decimals;
              const symbol = `${assetA.symbol}/${assetB.symbol}`;
              const name = `${assetA.name.split(" (")[0]}/${
                assetB.name.split(" (")[0]
              }`;

              tokenFull = {
                ...fallbackAsset,
                id: shareTokenId,
                poolAddress,
                assets: [assetA, assetB],
                isShareToken: true,
                decimals,
                symbol,
                name,
              };
            }
          }

          if (tokenFull) {
            acc.shareTokens.push(tokenFull);
            acc.shareTokensMap.set(tokenFull.id, tokenFull);
          }

          return acc;
        },
        { shareTokens: [], shareTokensMap: new Map([]) },
      );

      setAllAssets({
        ...allAssets,
        shareTokensRaw,
        shareTokens,
        shareTokensMap,
      });
    } catch (error) {
      console.error("Error fetching assets:", error);
    } finally {
      setLoading(false);
    }
  }, [api, client]);

  useEffect(() => {
    fetchAllAssets();
  }, [fetchAllAssets]);

  return { allAssets, loading };
}

export function useAllAssetsFunc() {
  const { allAssets, loading } = useAllAssets();
  const {
    all = new Map([]),
    hub = {},
    shareTokens = [],
    shareTokensMap = new Map([]),
  } = allAssets ?? {};

  const allWithShareTokensMap = useMemo(
    () => new Map([...all, ...shareTokensMap]),
    [all, shareTokensMap],
  );

  const getAsset = useCallback(
    (id) => allWithShareTokensMap.get(id),
    [allWithShareTokensMap],
  );

  const getAssetWithFallback = useCallback(
    (id) => getAsset(id) ?? fallbackAsset,
    [getAsset],
  );

  const getAssets = useCallback(
    (ids) => ids.map((id) => getAssetWithFallback(id)),
    [getAssetWithFallback],
  );

  const getShareToken = useCallback(
    (id) => shareTokensMap.get(id),
    [shareTokensMap],
  );

  const getShareTokens = useCallback(
    (ids) => ids.map((id) => getShareToken(id)),
    [getShareToken],
  );

  const getShareTokenByAddress = useCallback(
    (poolAddress) =>
      shareTokens.find((shareToken) => shareToken?.poolAddress === poolAddress),
    [shareTokens],
  );

  return {
    all,
    hub,
    getAsset,
    getAssetWithFallback,
    getAssets,
    getShareToken,
    getShareTokens,
    getShareTokenByAddress,
    loading,
  };
}
