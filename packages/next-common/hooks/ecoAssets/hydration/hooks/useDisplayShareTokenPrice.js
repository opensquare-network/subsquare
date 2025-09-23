import { useMemo } from "react";
import useTotalIssuances from "./useTotalIssuances";
import { useXYKSDKPools } from "./useHydrationPools";
import { getAllAssets, queryAssetPrice } from "../useAssetsTotal";
import BigNumber from "bignumber.js";
import { isNil } from "lodash-es";

export default function useDisplayShareTokenPrice(ids) {
  // TODO: await in useCallback
  const { getShareTokens, getAssetWithFallback } = getAllAssets();
  const pools = getShareTokens(ids);

  const { data: xykPools = [], isLoading: isPoolsLoading } = useXYKSDKPools();
  const { data: issuances, isLoading: isIssuanceLoading } = useTotalIssuances();

  const { ids: pricesIds, tvls: shareTokensTvl } = useMemo(() => {
    return pools.reduce(
      (acc, shareToken) => {
        const { poolAddress } = shareToken ?? {};

        if (!poolAddress) return acc;

        const pool = xykPools.find((pool) => poolAddress === pool.address);

        if (!pool) return acc;

        const { tokens } = pool;
        const cachedIds = acc.ids;

        const knownAssetPrice =
          tokens.find((token) => cachedIds.includes(token.id)) ??
          tokens.find((token) => token.isSufficient) ??
          tokens[0];

        if (!knownAssetPrice) return acc;

        const { balance, decimals, id } = knownAssetPrice;

        const shiftedBalance = BigNumber(balance).shiftedBy(-decimals);

        const tvl = shiftedBalance.multipliedBy(2).toString();

        acc.tvls.push({
          spotPriceId: id,
          tvl,
          shareTokenId: shareToken.id,
        });

        if (!cachedIds.includes(id)) {
          acc.ids.push(id);
        }

        return acc;
      },
      { ids: [], tvls: [] },
    );
  }, [pools, xykPools]);

  const isLoading = isIssuanceLoading || isPoolsLoading;

  const data = useMemo(() => {
    return shareTokensTvl
      .map((shareTokenTvl) => {
        const spotPrice = queryAssetPrice(shareTokenTvl.spotPriceId);

        const tvlDisplay = BigNumber(shareTokenTvl.tvl).multipliedBy(spotPrice);

        const totalIssuance = issuances?.get(shareTokenTvl.shareTokenId);

        const shareTokenMeta = getAssetWithFallback(shareTokenTvl.shareTokenId);

        if (!totalIssuance) return undefined;

        const shareTokenDisplay = tvlDisplay
          .div(totalIssuance.shiftedBy(-shareTokenMeta.decimals))
          .toFixed(6);

        return {
          tokenIn: shareTokenTvl.shareTokenId,
          tokenOut: "10",
          spotPrice: shareTokenDisplay,
        };
      })
      .filter((item) => !isNil(item));
  }, [getAssetWithFallback, issuances, shareTokensTvl]);

  return { data, isLoading, isInitialLoading: isLoading };
}
