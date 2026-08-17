import { isNil } from "lodash-es";
import { getAmmOutput, getFeeAdjustedSpotOutput, getSpotOutput } from "../amm";

export const EMPTY_STATE = {
  error: null,
  feeAdjustedSpotOut: null,
  isInitialLoading: false,
  isRefreshing: false,
  isStale: false,
  lpFee: null,
  lpFeeAmount: null,
  loading: false,
  quote: null,
  reserves: null,
  unitRate: null,
};

function buildQuoteStateFromPoolData({ amountIn, poolData, tokenIn }) {
  if (!poolData) {
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

  const hasPoolData = Boolean(poolData);
  const stateFromPoolData = buildQuoteStateFromPoolData({
    amountIn,
    poolData,
    tokenIn,
  });

  if (loading) {
    return {
      ...stateFromPoolData,
      isInitialLoading: !hasPoolData,
      isRefreshing: hasPoolData,
      loading: true,
    };
  }

  if (error) {
    return {
      ...stateFromPoolData,
      error,
      isStale: hasPoolData,
    };
  }

  if (!hasPoolData) {
    return EMPTY_STATE;
  }

  return stateFromPoolData;
}
