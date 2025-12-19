import BigNumber from "bignumber.js";
import { useCallback, useState, useEffect } from "react";
import useAllAssets from "./common/useAllAssets";
import useAccountBalance from "./common/useAccountBalance";
import { useHydrationSDK } from "next-common/hooks/ecoAssets/hydration/context/hydrationSDKContext";
import { external } from "./utils/assetUtils";

export async function queryAssetPrice(sdk, assetIn, assetOut = "10") {
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

async function calculateTotalBalance(sdk, balances) {
  let totalSum = new BigNumber(0);

  for (const { balance, asset } of balances) {
    try {
      if (!asset?.decimals || !balance?.total) {
        continue;
      }

      const total = new BigNumber(balance.total).shiftedBy(-asset.decimals);

      const spotPrice = await queryAssetPrice(sdk, asset.id, "10");

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
  const sdk = useHydrationSDK();
  const { allAssets, loading: allAssetsLoading } = useAllAssets();
  const { balances, isLoading: accountBalanceLoading } = useAccountBalance(
    address,
    allAssets,
    allAssetsLoading,
  );

  const { ctx } = sdk ?? {};

  const fetchData = useCallback(
    async (isCancelled) => {
      if (
        allAssetsLoading ||
        accountBalanceLoading ||
        !ctx ||
        !sdk ||
        isCancelled()
      ) {
        return;
      }

      setIsLoading(true);
      try {
        await ctx.pool.syncRegistry(external);
        if (isCancelled()) return;

        const totalBalance = await calculateTotalBalance(sdk, balances);
        if (isCancelled()) return;

        if (!isCancelled()) {
          setAssetsBalance(totalBalance);
        }
      } catch (error) {
        if (!isCancelled()) {
          console.error("Error calculating assets total:", error);
          setAssetsBalance("0");
        }
      } finally {
        if (!isCancelled()) {
          setIsLoading(false);
        }
      }
    },
    [allAssetsLoading, accountBalanceLoading, ctx, balances, sdk],
  );

  useEffect(() => {
    let cancelled = false;
    const isCancelled = () => cancelled;

    fetchData(isCancelled);

    return () => {
      cancelled = true;
    };
  }, [fetchData]);

  return { balance: assetsBalance, isLoading };
}
