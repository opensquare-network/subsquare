import { createSdkContext } from "@galacticcouncil/sdk";
import { ApiPromise, WsProvider } from "@polkadot/api";
import BigNumber from "bignumber.js";
import { useCallback, useState, useEffect } from "react";
import useAllAssets from "./common/useAllAssets";
import useAccountBalance from "./common/useAccountBalance";

//  Hydration SDK in provider?
const ws = "wss://rpc.hydradx.cloud";
const wsProvider = new WsProvider(ws, 2_500, {}, 60_000, 102400, 10 * 60_000);

const api = await ApiPromise.create({
  provider: wsProvider,
});

const sdk = await createSdkContext(api);

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
  const { balances, isLoading: accountBalanceLoading } = useAccountBalance(
    address,
    allAssets,
    allAssetsLoading,
  );

  const fetchData = useCallback(async () => {
    if (allAssetsLoading || accountBalanceLoading) {
      return;
    }

    setIsLoading(true);
    try {
      const totalBalance = await calculateTotalBalance(balances);
      setAssetsBalance(totalBalance);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [address, allAssetsLoading, balances, accountBalanceLoading]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { balance: assetsBalance, isLoading };
}
