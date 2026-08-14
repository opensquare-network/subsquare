import { isNil } from "lodash-es";
import { fromPrecision, toPrecision } from "next-common/utils";
import { bnToLocaleString } from "next-common/utils/bn";
import { isKusamaChain } from "next-common/utils/chain";
import { CHAIN } from "next-common/utils/constants";
import { getForeignAssetOrigin } from "next-common/utils/xcm/foreignAsset";

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

export function formatTokenAmount(value, decimals, maxDecimals = 4) {
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

function isPolkadotConsensusLocation(location) {
  const v4Location = location?.V4;
  return (
    v4Location?.parents === 2 &&
    v4Location?.interior?.X1?.[0]?.GlobalConsensus?.Polkadot === null
  );
}

export function isFeeAssetToken(token, feeAssetInfo) {
  if (!token || !feeAssetInfo) {
    return false;
  }
  if (token.type === "native") {
    return feeAssetInfo.type === "native";
  }
  if (token.type === "asset") {
    return (
      feeAssetInfo.type === "asset" &&
      token.assetId === feeAssetInfo.assetId
    );
  }
  if (token.type === "foreign" && isKusamaChain(CHAIN)) {
    return (
      feeAssetInfo.type === "foreignAsset" &&
      isPolkadotConsensusLocation(feeAssetInfo.location) &&
      getForeignAssetOrigin(token.location) === "Polkadot"
    );
  }
  return false;
}

export function calculateMaxAmount({
  balance,
  estimatedFee = 0n,
  existentialDeposit = 0n,
  feeMultiplier = 1n,
  isNative,
}) {
  if (isNil(balance)) {
    return null;
  }

  if (!isNative) {
    return balance;
  }

  const reserved = estimatedFee * feeMultiplier + existentialDeposit;
  if (balance <= reserved) {
    return 0n;
  }
  return balance - reserved;
}

export function getFeeEstimateTx(getTxFunc, getFakeTxFunc) {
  return getTxFunc() ?? getFakeTxFunc();
}

const MAX_FEE_MULTIPLIER = 2n;

export function getPayBalance({
  amountIn,
  balance,
  estimatedFee,
  existentialDeposit,
  feePaidFromInput,
  isNative,
}) {
  if (isNil(balance) || (isNative && isNil(existentialDeposit))) {
    return {
      insufficient: false,
      insufficientFee: false,
      maxAmount: null,
    };
  }

  const spendableAmount = calculateMaxAmount({
    balance,
    existentialDeposit: existentialDeposit ?? 0n,
    isNative,
  });
  const insufficient = amountIn > spendableAmount;

  if (feePaidFromInput && isNil(estimatedFee)) {
    return {
      insufficient,
      insufficientFee: false,
      maxAmount: null,
    };
  }

  if (!feePaidFromInput) {
    return {
      insufficient,
      insufficientFee: false,
      maxAmount: spendableAmount,
    };
  }

  const totalRequiredAmount = amountIn + estimatedFee;
  const insufficientFee =
    amountIn > 0n && totalRequiredAmount > spendableAmount;
  const maxFeeReserve = estimatedFee * MAX_FEE_MULTIPLIER;
  const maxAmount =
    spendableAmount > maxFeeReserve ? spendableAmount - maxFeeReserve : 0n;

  return {
    insufficient,
    insufficientFee,
    maxAmount,
  };
}
