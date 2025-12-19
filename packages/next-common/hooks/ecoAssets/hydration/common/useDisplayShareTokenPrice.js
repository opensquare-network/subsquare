import { useMemo, useEffect, useCallback, useState } from "react";
import useTotalIssuances from "./useTotalIssuances";
import { useXYKSDKPools } from "./useHydrationPools";
import { queryAssetPrice } from "../useAssetsTotal";
import { useAllAssetsFunc } from "./useAllAssets";
import BigNumber from "bignumber.js";
import { isNil } from "lodash-es";
import { useHydrationSDK } from "next-common/hooks/ecoAssets/hydration/context/hydrationSDKContext";

export default function useDisplayShareTokenPrice(ids) {
  const {
    getShareTokens,
    getAssetWithFallback,
    loading: allAssetsLoading,
  } = useAllAssetsFunc();
  const sdk = useHydrationSDK();

  const { data: xykPools = [], isLoading: isPoolsLoading } = useXYKSDKPools();
  const { data: issuances, isLoading: isIssuanceLoading } = useTotalIssuances();

  const [data, setData] = useState([]);

  const { ids: pricesIds, tvls: shareTokensTvl } = useMemo(() => {
    if (allAssetsLoading || !getShareTokens) {
      return { ids: [], tvls: [] };
    }
    const pools = getShareTokens(ids);
    return pools.reduce(
      (acc, shareToken) => {
        const { poolAddress } = shareToken ?? {};

        if (!poolAddress || !xykPools || !xykPools.length) return acc;

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
  }, [allAssetsLoading, getShareTokens, ids, xykPools]);

  const isLoading = isIssuanceLoading || isPoolsLoading || allAssetsLoading;

  const fetchData = useCallback(async () => {
    const displayShareTokenPrices = await Promise.all(
      shareTokensTvl.map(async (shareTokenTvl) => {
        const spotPrice = await queryAssetPrice(sdk, shareTokenTvl.spotPriceId);

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
      }),
    ).filter((item) => !isNil(item));

    setData(displayShareTokenPrices);
  }, [getAssetWithFallback, issuances, sdk, shareTokensTvl]);

  useEffect(() => {
    if (isLoading || !pricesIds.length) return;
    fetchData();
  }, [pricesIds, shareTokensTvl, isLoading, fetchData]);

  return { data, isLoading, isInitialLoading: isLoading };
}
