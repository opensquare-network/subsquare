import BigNumber from "bignumber.js";
import { useCallback, useState, useEffect } from "react";
import useAllAssets from "./common/useAllAssets";
import useAccountBalance, {
  useAccountAssetsMap,
} from "./common/useAccountBalance";
import { useHydrationSDK } from "./context/hydrationSDKContext";
import { queryAssetPrice } from "./queryAssetPrice";
import { external } from "./utils/assetUtils";

export default function useHydrationAssetsBalance(address) {
  const { allAssets, loading: allAssetsLoading } = useAllAssets();
  const { balances, isLoading: accountBalanceLoading } = useAccountBalance(
    address,
    allAssets,
    allAssetsLoading,
  );
  const accountAssetsMap = useAccountAssetsMap(balances, accountBalanceLoading);
  const sdk = useHydrationSDK();
  const { ctx } = sdk ?? {};

  const [balance, setBalance] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const fetchBalance = useCallback(
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

      setIsCalculating(true);
      try {
        await ctx.pool.syncRegistry(external);
        if (isCancelled()) return;

        let totalSum = new BigNumber(0);
        for (const {
          balance: itemBalance,
          asset,
        } of accountAssetsMap.values()) {
          if (isCancelled()) break;

          // Only account asset balances, exclude liquidity positions.
          if (asset.isShareToken || asset.isStableSwap) {
            continue;
          }

          try {
            if (!asset?.decimals || !itemBalance?.total) {
              continue;
            }

            const total = new BigNumber(itemBalance.total).shiftedBy(
              -asset.decimals,
            );
            const spotPrice = await queryAssetPrice(sdk, asset.id);

            if (!spotPrice || isNaN(spotPrice)) {
              continue;
            }

            totalSum = totalSum.plus(total.times(spotPrice));
          } catch (error) {
            console.error(error);
            continue;
          }
        }

        if (!isCancelled()) {
          setBalance(totalSum.toString());
        }
      } catch (error) {
        if (!isCancelled()) {
          console.error("Error calculating hydration assets balance:", error);
          setBalance("0");
        }
      } finally {
        if (!isCancelled()) {
          setIsCalculating(false);
        }
      }
    },
    [accountAssetsMap, accountBalanceLoading, allAssetsLoading, ctx, sdk],
  );

  useEffect(() => {
    let cancelled = false;
    const isCancelled = () => cancelled;

    fetchBalance(isCancelled);

    return () => {
      cancelled = true;
    };
  }, [fetchBalance]);

  const isLoading = allAssetsLoading || accountBalanceLoading || isCalculating;

  return { balance, isLoading };
}
