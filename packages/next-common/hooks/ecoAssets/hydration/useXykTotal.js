import { useState, useEffect } from "react";
import BigNumber from "bignumber.js";
import useAccountBalance, {
  useAccountAssetsMap,
} from "./common/useAccountBalance";
import useAllAssets from "./common/useAllAssets";
import { useHydrationSDK } from "./context/hydrationSDKContext";
import { queryAssetPrice } from "./useAssetsTotal";

export default function useXykTotal(address) {
  const { allAssets, loading: allAssetsLoading } = useAllAssets();
  const { balances, isLoading: isAccountAssetsLoading } = useAccountBalance(
    address,
    allAssets,
    allAssetsLoading,
  );
  const sdk = useHydrationSDK();
  const [xykTotal, setXykTotal] = useState("0");
  const [isCalculating, setIsCalculating] = useState(false);

  const accountAssetsMap = useAccountAssetsMap(
    balances,
    isAccountAssetsLoading,
  );

  useEffect(() => {
    let cancelled = false;

    const calculateTotal = async () => {
      if (!accountAssetsMap || isAccountAssetsLoading || !sdk) {
        if (!cancelled) {
          setXykTotal("0");
          setIsCalculating(false);
        }
        return;
      }

      const shareTokenBalances = [
        ...(accountAssetsMap
          .values()
          .filter(({ asset }) => asset.isShareToken) ?? []),
      ];

      if (!shareTokenBalances.length) {
        if (!cancelled) {
          setXykTotal("0");
          setIsCalculating(false);
        }
        return;
      }

      if (!cancelled) {
        setIsCalculating(true);
      }

      try {
        let totalSum = new BigNumber(0);

        for (const { asset, balance } of shareTokenBalances) {
          if (cancelled) break;

          const transferable = BigNumber(balance.transferable);

          if (transferable.gt(0)) {
            const spotPrice = await queryAssetPrice(sdk, asset.id);

            if (cancelled) break;

            if (!spotPrice || isNaN(spotPrice)) {
              continue;
            }

            const value = transferable
              .shiftedBy(-asset.decimals)
              .multipliedBy(spotPrice);

            if (!value.isNaN()) {
              totalSum = totalSum.plus(value);
            }
          }
        }

        if (!cancelled) {
          setXykTotal(totalSum.toString());
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Error calculating XYK total:", error);
          setXykTotal("0");
        }
      } finally {
        if (!cancelled) {
          setIsCalculating(false);
        }
      }
    };

    calculateTotal();

    return () => {
      cancelled = true;
    };
  }, [accountAssetsMap, isAccountAssetsLoading, sdk]);

  const isLoading = isAccountAssetsLoading || allAssetsLoading || isCalculating;

  return {
    balance: xykTotal,
    isLoading,
  };
}
