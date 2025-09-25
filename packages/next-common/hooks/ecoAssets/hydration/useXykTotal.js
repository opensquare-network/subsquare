import { useMemo } from "react";
import BigNumber from "bignumber.js";
import useAccountBalance, {
  useAccountAssetsMap,
} from "./common/useAccountBalance";
import useAllAssets from "./common/useAllAssets";
import useDisplayShareTokenPrice from "./common/useDisplayShareTokenPrice";
import { BN_NAN } from "./utils";

export default function useXykTotal(address) {
  const { allAssets, loading: allAssetsLoading } = useAllAssets();
  const { balances, isLoading: isAccountAssetsLoading } = useAccountBalance(
    address,
    allAssets,
    allAssetsLoading,
  );

  const accountAssetsMap = useAccountAssetsMap(
    balances,
    isAccountAssetsLoading,
  );

  const isLoading = isAccountAssetsLoading || allAssetsLoading;

  const shareTokenBalances = useMemo(() => {
    if (!accountAssetsMap || isAccountAssetsLoading) {
      return [];
    }

    return [
      ...(accountAssetsMap.values().filter(({ asset }) => asset.isShareToken) ??
        []),
    ];
  }, [accountAssetsMap, isAccountAssetsLoading]);

  const spotPrices = useDisplayShareTokenPrice(
    shareTokenBalances.map((token) => token.asset.id),
  );

  const xykTotal = useMemo(() => {
    if (!shareTokenBalances || !spotPrices.data || isLoading) return BN_NAN;
    return shareTokenBalances.reduce((acc, { asset, balance }) => {
      const transferable = BigNumber(balance.transferable);

      if (transferable.gt(0)) {
        const meta = asset;
        const spotPrice = spotPrices.data.find(
          (spotPrice) => spotPrice.tokenIn === meta.id,
        );

        const value = transferable
          .shiftedBy(-meta.decimals)
          .multipliedBy(spotPrice?.spotPrice ?? BN_NAN);

        return BigNumber(acc)
          .plus(!value.isNaN() ? value : BN_0)
          .toString();
      }

      return acc;
    }, "0");
  }, [shareTokenBalances, spotPrices.data, isLoading]);

  return {
    balance: xykTotal,
    isLoading,
  };
}
