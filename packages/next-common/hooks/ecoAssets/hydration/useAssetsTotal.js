import { createSdkContext, findNestedKey } from "@galacticcouncil/sdk";
import { ApiPromise, WsProvider } from "@polkadot/api";
import BigNumber from "bignumber.js";
import { useCallback, useState, useEffect } from "react";
import { HUB_ID, fetchShareTokens, fallbackAsset } from "./utils";
import useAllAssets from "./hooks/useAllAssets";

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

export async function getAllAssets() {
  const { client } = sdk ?? {};
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

  // TODO: split as hooks
  // return allAssets;

  const { shareTokens, shareTokensMap } = shareTokensRaw.reduce(
    (acc, token) => {
      if (!allAssets.all) {
        return acc;
      }
      const assetA = allAssets.all.get(token.assets[0]);
      const assetB = allAssets.all.get(token.assets[1]);

      if (assetA && assetB && assetA.symbol && assetB.symbol) {
        const assetDecimal =
          Number(assetA.id) > Number(assetB.id) ? assetB : assetA;
        const decimals = assetDecimal.decimals;
        const symbol = `${assetA.symbol}/${assetB.symbol}`;
        const name = `${assetA.name.split(" (")[0]}/${
          assetB.name.split(" (")[0]
        }`;
        const iconId = [
          isBond(assetA) ? assetA.underlyingAssetId : assetA.id,
          isBond(assetB) ? assetB.underlyingAssetId : assetB.id,
        ];

        const tokenFull = {
          ...fallbackAsset,
          id: token.shareTokenId,
          poolAddress: token.poolAddress,
          assets: [assetA, assetB],
          isShareToken: true,
          decimals,
          symbol,
          name,
          iconId,
        };
        acc.shareTokens.push(tokenFull);
        acc.shareTokensMap.set(tokenFull.id, tokenFull);
      }

      return acc;
    },
    { shareTokens: [], shareTokensMap: new Map([]) },
  );

  const allWithShareTokensMap = new Map([...all, ...shareTokensMap]);

  const getAsset = (id) => allWithShareTokensMap.get(id);

  const getAssetWithFallback = (id) => getAsset(id) ?? fallbackAsset;
  const getAssets = (ids) => ids.map((id) => getAssetWithFallback(id));

  const getShareToken = (id) => shareTokensMap.get(id);
  const getShareTokens = (ids) => ids.map((id) => getShareToken(id));

  const getShareTokenByAddress = (poolAddress) =>
    shareTokens.find((shareToken) => shareToken?.poolAddress === poolAddress);

  return {
    allAssets,
    getAsset,
    getAssetWithFallback,
    getAssets,
    getShareToken,
    getShareTokens,
    getShareTokenByAddress,
  };
}

export async function queryAssetPrice(assetIn, assetOut = "10") {
  if (!assetIn || !assetOut || !sdk) {
    return NaN;
  }

  if (assetIn === assetOut) {
    return 1;
  }

  const { api } = sdk;
  let spotPrice = NaN;
  try {
    const res = await api.router.getBestSpotPrice(
      assetIn.toString(),
      assetOut.toString(),
    );

    if (res && res.amount.isFinite()) {
      spotPrice = res.amount
        .shiftedBy(-res.decimals)
        .decimalPlaces(10)
        .toString();
    }
  } catch (error) {
    console.error(error);
  }

  return spotPrice;
}

async function queryTokenAssetTotalBalance(address, allAssets) {
  if (!address) {
    return;
  }

  const { client } = sdk ?? {};
  const { balanceV2 } = client ?? {};

  // const allAssets = await getAllAssets();
  const { all, native } = allAssets ?? {};
  const followedAssets = [];
  const followedErc20Tokens = [];

  for (const [, asset] of all) {
    if (!asset.isErc20 && asset.id !== NATIVE_ASSET_ID) {
      followedAssets.push(asset);
    } else if (asset.isErc20) {
      followedErc20Tokens.push(asset);
    }
  }

  const systemBalance = await balanceV2.getSystemBalance(address);
  const tokenBalance = await Promise.all(
    followedAssets.map(async (asset) => {
      const balance = await balanceV2.getTokenBalance(address, asset.id);

      return { balance, asset };
    }),
  );
  const erc20Balance = await Promise.all(
    followedErc20Tokens.map(async (asset) => {
      const balance = await balanceV2.getErc20Balance(address, asset.id);

      return { balance, asset };
    }),
  );

  return [
    { balance: systemBalance, asset: native },
    ...tokenBalance,
    ...erc20Balance,
  ];
}

async function calculateTotalBalance(balances) {
  let totalSum = new BigNumber(0);

  for (const { balance, asset } of balances) {
    try {
      const total = new BigNumber(balance.total).shiftedBy(-asset.decimals);
      const spotPrice = await queryAssetPrice(asset.id, "10");

      if (!spotPrice || isNaN(spotPrice)) {
        continue;
      }

      const totalDisplay = total.times(spotPrice);

      totalSum = totalSum.plus(totalDisplay);
    } catch (error) {
      console.error(error);
      continue;
    }
  }

  return totalSum.toString();
}

// Assets Balance
export default function useAssetsTotal(address) {
  const [assetsBalance, setAssetsBalance] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { data: allAssets } = useAllAssets();

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const balances = await queryTokenAssetTotalBalance(address, allAssets);
      const totalBalance = await calculateTotalBalance(balances);
      setAssetsBalance(totalBalance);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { balance: assetsBalance, isLoading };
}
