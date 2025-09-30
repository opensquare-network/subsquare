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

const internalIds = new Map([
  ["9999", "1000106"],
  ["100", "1000053"],
  ["482", undefined],
  ["123", undefined],
  ["9000", "1000103"],
  ["69420", "1000062"],
  ["25518", "1000035"],
  ["420", "1000036"],
  ["10", undefined],
  ["256", "1000023"],
  ["4", "1000026"],
  ["21", undefined],
  ["20", undefined],
  ["999", undefined],
  ["30", "1000019"],
  ["101", undefined],
  ["99", undefined],
  ["7777", "1000095"],
  ["11", "1000027"],
  ["30035", "1000025"],
  ["111", undefined],
  ["555", "1000104"],
  ["14", "1000076"],
  ["6", undefined],
  ["65454", undefined],
  ["8889", "1000091"],
  ["8886", "1000108"],
  ["42069", "1000034"],
  ["77", undefined],
  ["9002", "1000105"],
  ["33", undefined],
  ["15", undefined],
  ["2", undefined],
  ["9527", undefined],
  ["868367", undefined],
  ["42", "1000060"],
  ["5", undefined],
  ["18", "1000038"],
  ["7", undefined],
  ["4294967295", "1000052"],
  ["1984", "10"],
  ["20090103", undefined],
  ["22", "1000055"],
  ["79", undefined],
  ["777", undefined],
  ["1230", undefined],
  ["9003", undefined],
  ["1313", undefined],
  ["24", undefined],
  ["2023", undefined],
  ["8", undefined],
  ["2820", undefined],
  ["404", "1000089"],
  ["1000", undefined],
  ["8008", undefined],
  ["6666", "1000078"],
  ["1", undefined],
  ["12", undefined],
  ["31337", "1000085"],
  ["3", undefined],
  ["6969", "1000054"],
  ["1983", undefined],
  ["1337", "22"],
  ["666", "1000029"],
  ["17", "1000082"],
  ["25", "1000069"],
  ["69", "1000094"],
  ["23", "1000021"],
  ["5417", "1000096"],
  ["9001", "1000102"],
  ["1980", undefined],
  ["4157", "1000065"],
  ["660301", undefined],
  ["9", "1000028"],
  ["862812", undefined],
  ["888", "1000059"],
  ["2024", "1000070"],
  ["2230", "1000073"],
]);

const pink = {
  decimals: 10,
  id: "23",
  name: "PINK",
  origin: 1000,
  symbol: "PINK",
  isWhiteListed: false,
};

const ded = {
  decimals: 10,
  id: "30",
  name: "DED",
  origin: 1000,
  symbol: "DED",
  isWhiteListed: false,
};

const dota = {
  decimals: 4,
  id: "18",
  name: "DOTA",
  origin: 1000,
  symbol: "DOTA",
  isWhiteListed: false,
};

export const external = [
  {
    ...ded,
    internalId: "1000019",
  },
  {
    ...pink,
    internalId: "1000021",
  },
  {
    ...dota,
    internalId: "1000038",
  },
];

const getFullAsset = (asset) => {
  const isToken = asset.type === "Token";
  const isBond = asset.type === "Bond";
  const isStableSwap = asset.type === "StableSwap";
  const isExternal = asset.type === "External";
  const isErc20 = asset.type === "Erc20";
  const isShareToken = false;

  const parachainEntry = findNestedKey(asset.location, "parachain");

  let externalId = null;

  if (isExternal) {
    for (const [extId, intId] of internalIds.entries()) {
      if (intId === asset?.id) {
        externalId = extId;
        break;
      }
    }
  }

  return {
    ...asset,
    parachainId: parachainEntry?.parachain.toString() || undefined,
    existentialDeposit: asset.existentialDeposit,
    isToken,
    isBond,
    isStableSwap,
    isExternal,
    externalId,
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
  }, [client]);

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
