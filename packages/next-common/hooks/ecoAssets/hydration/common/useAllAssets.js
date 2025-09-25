import { createSdkContext, findNestedKey } from "@galacticcouncil/sdk";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { useCallback, useState, useEffect, useMemo } from "react";
import { HUB_ID, fallbackAsset, fetchShareTokens } from "../utils";

//  Hydration SDK in provider?
const ws = "wss://rpc.hydradx.cloud";
const wsProvider = new WsProvider(ws, 2_500, {}, 60_000, 102400, 10 * 60_000);

const api = await ApiPromise.create({
  provider: wsProvider,
});

const sdk = await createSdkContext(api);

const NATIVE_ASSET_ID = "0";
const bannedAssets = ["1000042"];

const ASSETHUB_ID_BLACKLIST = [
  "34",
  "41",
  "43",
  "47",
  "49",
  "52",
  "53",
  "54",
  "65",
  "73",
  "74",
  "75",
  "92",
  "92",
  "97",
  "22222000",
  "22222001",
  "22222002",
  "22222003",
  "22222004",
  "50000019",
  "50000030",
  "50000031",
  "50000032",
  "50000033",
  "50000034",
];

const getFullAsset = (asset) => {
  const isToken = asset.type === "Token";
  const isBond = asset.type === "Bond";
  const isStableSwap = asset.type === "StableSwap";
  const isExternal = asset.type === "External";
  const isErc20 = asset.type === "Erc20";
  const isShareToken = false;

  const parachainEntry = findNestedKey(asset.location, "parachain");

  return {
    ...asset,
    parachainId: parachainEntry?.parachain.toString() || undefined,
    existentialDeposit: asset.existentialDeposit,
    isToken,
    isBond,
    isStableSwap,
    isExternal,
    isErc20,
    isShareToken,
  };
};

export default function useAllAssets() {
  const { client } = sdk ?? {};
  const [allAssets, setAllAssets] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAllAssets = useCallback(async () => {
    if (!client) {
      return;
    }

    setLoading(true);
    try {
      const assets = await client.asset.getOnChainAssets();
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

      setAllAssets({ ...allAssets, shareTokensRaw });
    } catch (error) {
      console.error("Error fetching assets:", error);
    } finally {
      setLoading(false);
    }
  }, [client]);

  useEffect(() => {
    fetchAllAssets();
  }, [fetchAllAssets]);

  return { allAssets, loading };
}

// TODO: remove useless params
export function useAllAssetsFunc() {
  const { allAssets, loading } = useAllAssets();
  const { all = [], hub = {}, shareTokensRaw = [] } = allAssets ?? {};

  const { shareTokens, shareTokensMap } = useMemo(() => {
    if (!all || !loading) {
      return { shareTokens: [], shareTokensMap: new Map([]) };
    }

    return shareTokensRaw.reduce(
      (acc, token) => {
        if (!all) {
          return acc;
        }
        const assetA = all.get(token.assets[0]);
        const assetB = all.get(token.assets[1]);

        if (assetA && assetB && assetA.symbol && assetB.symbol) {
          const assetDecimal =
            Number(assetA.id) > Number(assetB.id) ? assetB : assetA;
          const decimals = assetDecimal.decimals;
          const symbol = `${assetA.symbol}/${assetB.symbol}`;
          const name = `${assetA.name.split(" (")[0]}/${
            assetB.name.split(" (")[0]
          }`;

          const tokenFull = {
            ...fallbackAsset,
            id: token.shareTokenId,
            poolAddress: token.poolAddress,
            assets: [assetA, assetB],
            isShareToken: true,
            decimals,
            symbol,
            name,
          };
          acc.shareTokens.push(tokenFull);
          acc.shareTokensMap.set(tokenFull.id, tokenFull);
        }

        return acc;
      },
      { shareTokens: [], shareTokensMap: new Map([]) },
    );
  }, [all, loading, shareTokensRaw]);

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
