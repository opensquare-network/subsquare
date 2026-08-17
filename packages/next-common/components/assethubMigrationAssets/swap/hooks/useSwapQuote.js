import { isNil } from "lodash-es";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAsync, useIsomorphicLayoutEffect } from "react-use";
import { useAssetHubPapi } from "next-common/hooks/chain/useAssetHubApi";
import { buildQuoteState } from "./quoteState";

function getPairKey(tokenIn, tokenOut) {
  return tokenIn && tokenOut ? `${tokenIn.key}:${tokenOut.key}` : null;
}

async function fetchPoolData(papi, tokenIn, tokenOut) {
  const [rawReserves, lpFee] = await Promise.all([
    papi.apis.AssetConversionApi.get_reserves(
      tokenIn.location,
      tokenOut.location,
    ),
    papi.constants.AssetConversion.LPFee(),
  ]);
  let reserves = null;
  if (!isNil(rawReserves)) {
    reserves = { reserveIn: rawReserves[0], reserveOut: rawReserves[1] };
  }
  return { pairKey: getPairKey(tokenIn, tokenOut), reserves, lpFee };
}

export default function useSwapQuote({ amountIn, tokenIn, tokenOut }) {
  const papi = useAssetHubPapi();
  const [reloadTick, setReloadTick] = useState(0);
  const [lastKnownPoolData, setLastKnownPoolData] = useState(null);
  const [refreshVersion, setRefreshVersion] = useState(0);
  const pairKey = getPairKey(tokenIn, tokenOut);
  const lastPairKeyRef = useRef(pairKey);
  const {
    error,
    loading,
    value: fetchedPoolData,
  } = useAsync(async () => {
    if (!papi || !tokenIn || !tokenOut) {
      return null;
    }

    try {
      return await fetchPoolData(papi, tokenIn, tokenOut);
    } catch (fetchError) {
      console.error("Failed to fetch swap pool data", fetchError);
      throw fetchError;
    }
  }, [papi, reloadTick, tokenIn, tokenOut]);

  useIsomorphicLayoutEffect(() => {
    if (lastPairKeyRef.current === pairKey) {
      return;
    }
    lastPairKeyRef.current = pairKey;
    setLastKnownPoolData(null);
  }, [pairKey]);

  useEffect(() => {
    if (!loading && !error && fetchedPoolData?.pairKey === pairKey) {
      setLastKnownPoolData(fetchedPoolData);
      setRefreshVersion((version) => version + 1);
    }
  }, [error, fetchedPoolData, loading, pairKey]);

  const isSamePair = fetchedPoolData?.pairKey === pairKey;
  const canUseFetched = !loading && !error && isSamePair;
  const quotePoolData = canUseFetched ? fetchedPoolData : lastKnownPoolData;

  const state = useMemo(
    () =>
      buildQuoteState({
        amountIn,
        error,
        loading,
        poolData: quotePoolData,
        tokenIn,
        tokenOut,
      }),
    [amountIn, error, loading, quotePoolData, tokenIn, tokenOut],
  );

  const refresh = useCallback(() => setReloadTick((n) => n + 1), []);

  return { ...state, refresh, refreshVersion };
}
