import { createSdkContext, findNestedKey } from "@galacticcouncil/sdk";
import { ApiPromise, WsProvider } from "@polkadot/api";
import BigNumber from "bignumber.js";
import { useCallback, useState, useEffect } from "react";

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

async function getAllAssets() {
  const { client } = sdk ?? {};
  const assets = await client.asset.getOnChainAssets();

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

      return acc;
    },
    {
      all: new Map([]),
      native: {},
    },
  );

  return allAssets;
}

export async function queryAssetPrice(assetIn, assetOut) {
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

async function queryTokenAssetTotalBalance(address) {
  if (!address) {
    return;
  }

  const { client } = sdk ?? {};
  const { balanceV2 } = client ?? {};

  const { all, native } = await getAllAssets();
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

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const balances = await queryTokenAssetTotalBalance(address);
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
