import { useCallback, useEffect, useState } from "react";
import BigNumber from "bignumber.js";
import useAllAssets from "./common/useAllAssets";
import useAccountBalance, {
  useAccountAssetsMap,
} from "./common/useAccountBalance";
import { useHydrationSDK } from "./context/hydrationSDKContext";
import { queryAssetPrice } from "./queryAssetPrice";
import { external } from "./utils/assetUtils";

async function computeFiatValues(sdk, asset, balance) {
  if (!asset?.decimals) {
    return { fiatValue: null, transferableFiatValue: null };
  }

  const spotPrice = await queryAssetPrice(sdk, asset.id);
  if (!spotPrice || isNaN(spotPrice)) {
    return { fiatValue: null, transferableFiatValue: null };
  }

  const compute = (amount) => {
    if (!amount) {
      return null;
    }

    const value = new BigNumber(amount)
      .shiftedBy(-asset.decimals)
      .times(spotPrice);

    return value.isZero() ? null : value.toString();
  };

  return {
    fiatValue: compute(balance.total),
    transferableFiatValue: compute(balance.transferable),
  };
}

export default function useHydrationAssetsList(address) {
  const { allAssets, loading: allAssetsLoading } = useAllAssets();
  const { balances, isLoading: accountBalanceLoading } = useAccountBalance(
    address,
    allAssets,
    allAssetsLoading,
  );
  const accountAssetsMap = useAccountAssetsMap(balances, accountBalanceLoading);
  const sdk = useHydrationSDK();
  const { ctx } = sdk ?? {};

  const [assets, setAssets] = useState([]);
  const [isCalculating, setIsCalculating] = useState(false);

  const fetchAssets = useCallback(
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

        const items = [];
        for (const { balance, asset } of accountAssetsMap.values()) {
          if (isCancelled()) break;

          if (!asset.isToken && !asset.isErc20) {
            continue;
          }

          let fiatValue = null;
          let transferableFiatValue = null;
          try {
            ({ fiatValue, transferableFiatValue } = await computeFiatValues(
              sdk,
              asset,
              balance,
            ));
          } catch (error) {
            console.error(error);
          }

          items.push({
            assetId: asset.id,
            symbol: asset.symbol,
            name: asset.name,
            decimals: asset.decimals,
            type: asset.type,
            balance: balance.total,
            transferable: balance.transferable,
            fiatValue,
            transferableFiatValue,
          });
        }

        if (!isCancelled()) {
          items.sort((a, b) => {
            const aValue = a.fiatValue ? new BigNumber(a.fiatValue) : null;
            const bValue = b.fiatValue ? new BigNumber(b.fiatValue) : null;

            if (aValue && bValue) {
              return bValue.minus(aValue).toNumber();
            }
            if (aValue) {
              return -1;
            }
            if (bValue) {
              return 1;
            }
            return (a.symbol || "").localeCompare(b.symbol || "");
          });

          setAssets(items);
        }
      } catch (error) {
        if (!isCancelled()) {
          console.error("Error calculating hydration assets:", error);
          setAssets([]);
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

    fetchAssets(isCancelled);

    return () => {
      cancelled = true;
    };
  }, [fetchAssets]);

  const isLoading = allAssetsLoading || accountBalanceLoading || isCalculating;

  return { assets, isLoading };
}
