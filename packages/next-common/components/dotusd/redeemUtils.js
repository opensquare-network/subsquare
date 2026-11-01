import { isNil } from "lodash-es";
import {
  PERMILL_UNIT,
  formatAssetAmount,
  isLocalAssetLocation,
  toBigIntOrNull,
} from "./psmUtils";

function toPlaces(decimals) {
  return Number.isInteger(decimals) && decimals > 0 ? decimals : 0;
}

// `internal_to_external` / `external_to_internal`: scale up by the difference in decimals,
// floor-divide when going the other way.
function scaleDown(amount, fromPlaces, toPlaces) {
  return amount / 10n ** BigInt(fromPlaces - toPlaces);
}

function scaleUp(amount, fromPlaces, toPlaces) {
  return amount * 10n ** BigInt(toPlaces - fromPlaces);
}

/**
 * What a redeem would yield, mirroring `frame/psm`'s `redeem` dispatchable: the redemption fee
 * is taken off the internal amount with ceiling rounding, the remainder is converted to the
 * external asset, and only the part of that conversion which survives the round trip back is
 * actually burned — any truncation dust stays with the user.
 *
 * The fee and every internal figure are in internal (dotUSD) units; `externalOut` is what the
 * user receives.
 */
export function computeRedeemQuote({
  internalAmount,
  internalDecimals,
  externalDecimals,
  redemptionFeePermill,
  minSwapAmount,
  debt,
} = {}) {
  if (isNil(internalAmount) || internalAmount <= 0n) {
    return null;
  }

  const internalPlaces = toPlaces(internalDecimals);
  const externalPlaces = toPlaces(externalDecimals);

  const feePermill = BigInt(
    Math.max(0, Math.round(Number(redemptionFeePermill ?? 0))),
  );
  // fee_rate.mul_ceil
  const fee =
    (internalAmount * feePermill + BigInt(PERMILL_UNIT) - 1n) /
    BigInt(PERMILL_UNIT);
  const internalNet = internalAmount - fee;

  const externalOut =
    externalPlaces >= internalPlaces
      ? scaleUp(internalNet, internalPlaces, externalPlaces)
      : scaleDown(internalNet, internalPlaces, externalPlaces);

  // What is actually burned, and what the pair's debt is decremented by.
  const effectiveInternalNet =
    internalPlaces >= externalPlaces
      ? scaleUp(externalOut, externalPlaces, internalPlaces)
      : scaleDown(externalOut, externalPlaces, internalPlaces);

  const min = toBigIntOrNull(minSwapAmount);
  const debtValue = toBigIntOrNull(debt);

  return {
    fee,
    internalNet,
    externalOut,
    effectiveInternalNet,
    // What leaves the user's account: the burn plus the fee. The event reports it this way, and
    // it can be a hair under the amount they typed when the conversion truncates.
    consumed: effectiveInternalNet + fee,
    // The conversion floor-divide rounded the payout away entirely.
    amountTooSmall: internalNet !== 0n && externalOut === 0n,
    // Checked against the raw amount, before the fee is taken.
    belowMinimum: !isNil(min) && internalAmount < min,
    // The pallet's `InsufficientReserve`, which guards the pair's tracked debt rather than the
    // reserve's token balance: you cannot redeem more of an asset than is still outstanding
    // against it. The reserve itself is only a defensive check, and debt <= reserve holds by
    // construction, so this is the binding limit.
    exceedsDebt: !isNil(debtValue) && effectiveInternalNet > debtValue,
  };
}

/**
 * Why the redeem cannot be submitted, or null when it can. As with mint, the first matching
 * reason wins so the tooltip names what to fix next rather than a downstream symptom.
 */
export function getRedeemDisabledReason({
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

  if (isNil(internal?.index)) {
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

  // Redemption stays open while minting is disabled — that is the point of the middle circuit
  // breaker state — so only AllDisabled stops it.
  if (external.status === "AllDisabled") {
    return "Swaps are disabled for this asset";
  }

  if (
    external.status !== "AllEnabled" &&
    external.status !== "MintingDisabled"
  ) {
    return "Redemption availability is unknown";
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

  // transferrable, not balance: a frozen asset account cannot be burned from.
  if (amount?.amount > BigInt(balance)) {
    return `Insufficient ${internal.symbol ?? "dotUSD"} balance`;
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

    return `Minimum redeem is ${minimum} ${symbol}`;
  }

  if (quote.externalOut <= 0n) {
    return "The amount leaves nothing to redeem";
  }

  if (quote.exceedsDebt) {
    return "Amount exceeds what the PSM can redeem for this asset";
  }

  return null;
}
