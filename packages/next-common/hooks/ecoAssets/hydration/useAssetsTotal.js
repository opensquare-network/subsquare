import { createSdkContext } from "@galacticcouncil/sdk";
import { ApiPromise, WsProvider } from "@polkadot/api";
import BigNumber from "bignumber.js";
import { useCallback, useState, useEffect } from "react";
import useAllAssets from "./common/useAllAssets";

//  Hydration SDK in provider?
const ws = "wss://rpc.hydradx.cloud";
const wsProvider = new WsProvider(ws, 2_500, {}, 60_000, 102400, 10 * 60_000);

const api = await ApiPromise.create({
  provider: wsProvider,
});

const sdk = await createSdkContext(api);

const NATIVE_ASSET_ID = "0";

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
  const { allAssets, loading: allAssetsLoading } = useAllAssets();

  const fetchData = useCallback(async () => {
    if (allAssetsLoading) {
      return;
    }

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
  }, [address, allAssetsLoading]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { balance: assetsBalance, isLoading };
}
