import { isNil } from "lodash-es";
import {
  PERMILL_UNIT,
  formatAssetAmount,
  isLocalAssetLocation,
  toBigIntOrNull,
} from "./psmUtils";

/**
 * What a mint would yield, mirroring `frame/psm`'s `mint` dispatchable: the amount is scaled
 * to the internal asset's decimals (multiplied up, floor-divided down), the fee is taken from
 * the internal equivalent with ceiling rounding so the protocol never undercharges, and the
 * user receives the remainder.
 */
export function computeMintQuote({
  externalAmount,
  externalDecimals,
  internalDecimals,
  minSwapAmount,
  mintingFeePermill,
  debt,
  cap,
  maxDebt,
  totalDebt,
} = {}) {
  if (isNil(externalAmount) || externalAmount <= 0n) {
    return null;
  }

  const externalPlaces =
    Number.isInteger(externalDecimals) && externalDecimals > 0 ? externalDecimals : 0;
  const internalPlaces =
    Number.isInteger(internalDecimals) && internalDecimals > 0 ? internalDecimals : 0;
  const diff = internalPlaces - externalPlaces;

  const internalEquivalent =
    diff >= 0
      ? externalAmount * 10n ** BigInt(diff)
      : externalAmount / 10n ** BigInt(-diff);

  const feePermill = BigInt(
    Math.max(0, Math.round(Number(mintingFeePermill ?? 0))),
  );
  // fee_rate.mul_ceil
  const fee =
    (internalEquivalent * feePermill + BigInt(PERMILL_UNIT) - 1n) /
    BigInt(PERMILL_UNIT);
  const received = internalEquivalent - fee;

  const min = toBigIntOrNull(minSwapAmount);
  const capValue = toBigIntOrNull(cap);
  const maxDebtValue = toBigIntOrNull(maxDebt);
  const debtValue = toBigIntOrNull(debt) ?? 0n;
  const totalDebtValue = toBigIntOrNull(totalDebt) ?? 0n;

  return {
    internalEquivalent,
    fee,
    received,
    // The conversion floor-divide rounded the amount away entirely.
    amountTooSmall: internalEquivalent === 0n,
    belowMinimum: !isNil(min) && internalEquivalent < min,
    // The per-asset ceiling is compared against the equivalent including the fee: that is what
    // the pallet adds to the debt.
    exceedsCap: !isNil(capValue) && debtValue + internalEquivalent > capValue,
    // Debt already at or above the ceiling, e.g. after a weight reallocation.
    atCap: !isNil(capValue) && debtValue >= capValue,
    exceedsMaxDebt:
      !isNil(maxDebtValue) &&
      totalDebtValue + internalEquivalent > maxDebtValue,
  };
}

/**
 * Why the mint cannot be submitted, or null when it can. Returning the first reason rather
 * than a set means the tooltip always names the next thing to fix instead of a downstream
 * symptom. Pure so the ordering itself is covered by tests.
 */
export function getMintDisabledReason({
  apiReady,
  address,
  dataLoading,
  internal,
  external,
  balanceLoading,
  balance,
  amount,
  quote,
  minSwapAmount,
} = {}) {
  if (!apiReady) {
    return "Asset Hub RPC is not connected yet";
  }

  if (!address) {
    return "Please connect your wallet";
  }

  if (dataLoading) {
    return "Loading PSM data";
  }

  if (internal?.index == null) {
    return "The dotUSD asset is unknown";
  }

  if (!external) {
    return "No approved external asset";
  }

  if (
    !isLocalAssetLocation(internal.location) ||
    !isLocalAssetLocation(external.location)
  ) {
    return "Unsupported PSM asset location";
  }

  // The circuit breaker is three state; only AllEnabled allows minting, and the pallet also
  // stops minting when the debt sits above a ceiling the weights were reallocated under.
  if (external.status === "MintingDisabled") {
    return "Minting is disabled for this asset";
  }

  if (external.status === "AllDisabled") {
    return "Swaps are disabled for this asset";
  }

  if (external.status !== "AllEnabled") {
    return "Minting availability is unknown";
  }

  if (amount?.isEmpty) {
    return "Please enter an amount";
  }

  if (amount?.error) {
    return amount.error;
  }

  if (balanceLoading) {
    return "Loading your balance";
  }

  if (isNil(balance)) {
    return "Balance information is unavailable";
  }

  // transferrable, not balance: a frozen asset account cannot be debited.
  if (amount?.amount > BigInt(balance)) {
    return `Insufficient ${external.symbol} balance`;
  }

  if (!quote) {
    return "The amount could not be priced";
  }

  if (quote.amountTooSmall) {
    return "Amount is too small after conversion";
  }

  if (quote.belowMinimum) {
    const symbol = internal.symbol ?? "dotUSD";
    const minimum = formatAssetAmount(minSwapAmount, internal.decimals);

    return `Minimum mint is ${minimum} ${symbol}`;
  }

  if (quote.received <= 0n) {
    return "The fee leaves nothing to receive";
  }

  if (quote.atCap) {
    return "This asset is already at its cap";
  }

  if (quote.exceedsCap) {
    return "Amount exceeds the remaining cap for this asset";
  }

  if (quote.exceedsMaxDebt) {
    return "Amount exceeds the PSM max debt";
  }

  return null;
}
