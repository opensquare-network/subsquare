import { isNil } from "lodash-es";
import { fromPrecision, toPrecision } from "next-common/utils";
import { bnToLocaleString } from "next-common/utils/bn";

export function parseTokenAmount(value, decimals) {
  try {
    const plancks = BigInt(fromPrecision(value || "0", decimals).split(".")[0]);
    if (plancks < 0n) {
      return 0n;
    }
    return plancks;
  } catch {
    return 0n;
  }
}

export function formatTokenAmount(value, decimals, maxDecimals = 6) {
  if (isNil(value)) {
    return "-";
  }
  return bnToLocaleString(toPrecision(value, decimals), maxDecimals);
}

const percentFormatter = new Intl.NumberFormat(undefined, {
  style: "percent",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export function formatPercent(ratio) {
  return percentFormatter.format(ratio);
}

export function getUniqueTokens(pools = []) {
  const tokens = new Map();
  pools.forEach((pool) => {
    tokens.set(pool.token1.key, pool.token1);
    tokens.set(pool.token2.key, pool.token2);
  });
  return [...tokens.values()];
}

export function getDirectTokens(pools = [], oppositeTokenKey) {
  if (!oppositeTokenKey) {
    return getUniqueTokens(pools);
  }

  const tokens = new Map();
  pools.forEach((pool) => {
    if (pool.token1.key === oppositeTokenKey) {
      tokens.set(pool.token2.key, pool.token2);
    } else if (pool.token2.key === oppositeTokenKey) {
      tokens.set(pool.token1.key, pool.token1);
    }
  });
  return [...tokens.values()];
}

export function calculateMaxAmount({
  balance,
  estimatedFee = 0n,
  existentialDeposit = 0n,
  isNative,
}) {
  if (isNil(balance)) {
    return null;
  }

  if (!isNative) {
    return balance;
  }

  const reserved = estimatedFee + existentialDeposit;
  if (balance <= reserved) {
    return 0n;
  }
  return balance - reserved;
}

export function isInsufficientBalance({
  amountIn,
  balance,
  isNative,
  maxAmount,
}) {
  if (isNative) {
    return !isNil(maxAmount) && amountIn > maxAmount;
  }
  return !isNil(balance) && amountIn > balance;
}
