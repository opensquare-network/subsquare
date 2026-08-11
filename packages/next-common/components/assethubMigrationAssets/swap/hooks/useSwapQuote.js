import { isNil } from "lodash-es";
import { useCallback, useMemo, useState } from "react";
import { useAsync } from "react-use";
import { useAssetHubPapi } from "next-common/hooks/chain/useAssetHubApi";
import { getAmmOutput, getFeeAdjustedSpotOutput, getSpotOutput } from "../amm";

const EMPTY_STATE = {
  feeAdjustedSpotOut: null,
  lpFee: null,
  lpFeeAmount: null,
  loading: false,
  quote: null,
  reserves: null,
  unitRate: null,
};

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
  return { reserves, lpFee };
}

export function buildQuoteState({
  amountIn,
  error,
  loading,
  poolData,
  tokenIn,
  tokenOut,
}) {
  if (!tokenIn || !tokenOut) {
    return EMPTY_STATE;
  }

  if (loading) {
    return { ...EMPTY_STATE, loading: true };
  }

  if (error || !poolData) {
    return EMPTY_STATE;
  }

  const { reserves, lpFee } = poolData;
  if (isNil(reserves) || isNil(lpFee)) {
    return { ...EMPTY_STATE, lpFee: lpFee ?? null };
  }

  const unitIn = 10n ** BigInt(tokenIn.decimals);
  const unitRate = getSpotOutput(
    unitIn,
    reserves.reserveIn,
    reserves.reserveOut,
  );

  if (amountIn <= 0n) {
    return {
      ...EMPTY_STATE,
      lpFee,
      reserves,
      unitRate,
    };
  }

  const amm = getAmmOutput(
    amountIn,
    reserves.reserveIn,
    reserves.reserveOut,
    lpFee,
  );
  const feeAdjustedSpotOut = getFeeAdjustedSpotOutput(
    amountIn,
    reserves.reserveIn,
    reserves.reserveOut,
    lpFee,
  );

  return {
    ...EMPTY_STATE,
    feeAdjustedSpotOut,
    lpFee,
    lpFeeAmount: amm?.protocolCommission ?? null,
    quote: amm?.amountOut ?? null,
    reserves,
    unitRate,
  };
}

export default function useSwapQuote({ amountIn, tokenIn, tokenOut }) {
  const papi = useAssetHubPapi();
  const [reloadTick, setReloadTick] = useState(0);
  const {
    error,
    loading,
    value: poolData,
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

  const state = useMemo(
    () =>
      buildQuoteState({
        amountIn,
        error,
        loading,
        poolData,
        tokenIn,
        tokenOut,
      }),
    [amountIn, error, loading, poolData, tokenIn, tokenOut],
  );

  const refresh = useCallback(() => setReloadTick((n) => n + 1), []);

  return { ...state, refresh };
}
