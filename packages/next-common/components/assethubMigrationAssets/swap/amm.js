// Reference: https://github.com/kheopswap/kheopswap/blob/main/web/src/utils/ammMath.ts

import { isNil } from "lodash-es";
import { BPS_DENOMINATOR } from "./constants";

const BPS_DENOMINATOR_BIGINT = BigInt(BPS_DENOMINATOR);

export function getLpFeeUnit(lpFee) {
  if (BigInt(lpFee) >= 1000n) {
    return 1_000_000n;
  }
  return 1_000n;
}

export function getAmmOutput(amountIn, reserveIn, reserveOut, lpFee) {
  if (reserveIn === 0n || reserveOut === 0n) {
    return null;
  }
  const feeUnit = getLpFeeUnit(lpFee);
  const amountInWithFee = amountIn * (feeUnit - BigInt(lpFee));
  const protocolCommission = (feeUnit * amountIn - amountInWithFee) / feeUnit;
  const numerator = amountInWithFee * reserveOut;
  const denominator = reserveIn * feeUnit + amountInWithFee;
  const amountOut = numerator / denominator;
  return { amountOut, protocolCommission };
}

export function getSpotOutput(amountIn, reserveIn, reserveOut) {
  if (reserveIn === 0n || reserveOut === 0n) {
    return 0n;
  }
  return (amountIn * reserveOut) / reserveIn;
}

export function getFeeAdjustedSpotOutput(
  amountIn,
  reserveIn,
  reserveOut,
  lpFee,
) {
  if (reserveIn === 0n || reserveOut === 0n) {
    return 0n;
  }

  const feeUnit = getLpFeeUnit(lpFee);
  const amountInWithFee = amountIn * (feeUnit - BigInt(lpFee));
  return (amountInWithFee * reserveOut) / (reserveIn * feeUnit);
}

export function getPriceImpact(spotOut, actualOut) {
  if (spotOut === 0n) {
    return 0;
  }
  const impactBps = (BPS_DENOMINATOR_BIGINT * (spotOut - actualOut)) / spotOut;
  if (impactBps === 0n) {
    return 0;
  }
  return -Number(impactBps) / BPS_DENOMINATOR;
}

export function calculateMinimumReceived(amountOut, slippageBps) {
  if (isNil(amountOut) || amountOut <= 0n) {
    return null;
  }

  const minimumReceived =
    (amountOut * (BPS_DENOMINATOR_BIGINT - BigInt(slippageBps))) /
    BPS_DENOMINATOR_BIGINT;

  if (minimumReceived <= 0n) {
    return null;
  }
  return minimumReceived;
}
