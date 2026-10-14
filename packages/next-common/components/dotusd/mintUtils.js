import BigNumber from "bignumber.js";
import { isNil } from "lodash-es";

// Asset Hub references its own assets as the XCM location `(PalletInstance 50, GeneralIndex
// <asset id>)`.
export const ASSETS_PALLET_INSTANCE = 50;

// Permill is parts per million: 1_000_000 = 100%.
export const PERMILL_UNIT = 1_000_000;

// Floor for the max fee the mint is willing to accept, in Permill parts: 1_000 = 0.1%. The live
// minting fee is 0%, so this is what the field shows today; see resolveMaxFeePermill for why it
// is a floor rather than a fixed value.
export const MIN_MAX_FEE_PERMILL = 1_000;

const U128_MAX = 2n ** 128n - 1n;

export function normalizeAssetId(value) {
  if (isNil(value) || value === "") {
    return null;
  }

  const id = Number(value);

  // A fractional, negative or out-of-range id would encode to a location that points at a
  // different asset, so it is refused rather than rounded.
  if (!Number.isSafeInteger(id) || id < 0) {
    return null;
  }

  return id;
}

/**
 * Builds the location `psm.mint` expects for an Asset Hub local asset. The page reads PSM
 * locations through papi, which decodes them as `{ interior: { type, value } }`; polkadot-js
 * cannot encode that shape (it fails with `failed decoding psm.mint`), it wants
 * `{ interior: { X2: [...] } }`.
 *
 * Building it from the asset id rather than converting the decoded object is deliberate: the
 * result is the exact inverse of assetIndexFromLocation, it has one possible output per id,
 * and it cannot silently turn an unfamiliar location into a *different* valid one. Whether the
 * stored location really is a local asset is checked separately by isLocalAssetLocation.
 */
export function buildLocalAssetLocation(assetId) {
  const id = normalizeAssetId(assetId);

  if (isNil(id)) {
    return null;
  }

  return {
    parents: 0,
    interior: {
      X2: [{ PalletInstance: ASSETS_PALLET_INSTANCE }, { GeneralIndex: id }],
    },
  };
}

/**
 * Whether a papi-decoded location is an Asset Hub local asset, i.e. one this page can build a
 * transaction argument for. Anything else (a relay chain location, a foreign asset reached
 * through GlobalConsensus) is reported as unsupported instead of being approximated.
 */
export function isLocalAssetLocation(location) {
  if (isNil(location)) {
    return false;
  }

  if (Number(location.parents ?? 0) !== 0) {
    return false;
  }

  const interior = location.interior;

  if (interior?.type !== "X2" || !Array.isArray(interior.value)) {
    return false;
  }

  const [pallet, index] = interior.value;

  return (
    pallet?.type === "PalletInstance" &&
    Number(pallet.value) === ASSETS_PALLET_INSTANCE &&
    index?.type === "GeneralIndex" &&
    !isNil(normalizeAssetId(index.value))
  );
}

/**
 * The `max_fee` to send with the mint. The pallet rejects the call outright when the pair's
 * configured fee is above it (`FeeTooHigh`), so a hardcoded constant would block minting the
 * day governance raises the fee past it. Flooring the pair's own fee keeps the value valid and
 * still bounded, and it stays meaningful as a protection: the user is never signing a blank
 * cheque on the fee.
 */
export function resolveMaxFeePermill(mintingFeePermill) {
  const fee = Number(mintingFeePermill ?? 0);

  if (!Number.isFinite(fee) || fee < 0) {
    return MIN_MAX_FEE_PERMILL;
  }

  return Math.max(fee, MIN_MAX_FEE_PERMILL);
}

/**
 * Parses the amount field into planck. `isEmpty` is kept apart from `error` so a blank field
 * can be reported as "enter an amount" rather than "invalid amount".
 */
export function parseExternalAmount(value, decimals = 0) {
  const text = String(value ?? "").trim();

  if (!text) {
    return { amount: null, isEmpty: true, error: null };
  }

  const parsed = new BigNumber(text);

  if (!parsed.isFinite() || parsed.lte(0)) {
    return { amount: null, isEmpty: false, error: "Invalid amount" };
  }

  const places = Number.isInteger(decimals) && decimals > 0 ? decimals : 0;
  const scaled = parsed.multipliedBy(new BigNumber(10).pow(places));

  if (!scaled.isInteger()) {
    return {
      amount: null,
      isEmpty: false,
      error: `Only ${places} decimals are supported`,
    };
  }

  const amount = BigInt(scaled.toFixed(0));

  // The chain would reject anything wider than a u128 at encoding time.
  if (amount > U128_MAX) {
    return { amount: null, isEmpty: false, error: "Amount is too large" };
  }

  return { amount, isEmpty: false, error: null };
}

function toBigInt(value) {
  if (isNil(value) || value === "") {
    return null;
  }

  try {
    return BigInt(value);
  } catch {
    return null;
  }
}

/**
 * What the mint would yield, mirroring `frame/psm`'s `mint` dispatchable: the amount is scaled
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

  const min = toBigInt(minSwapAmount);
  const capValue = toBigInt(cap);
  const maxDebtValue = toBigInt(maxDebt);
  const debtValue = toBigInt(debt) ?? 0n;
  const totalDebtValue = toBigInt(totalDebt) ?? 0n;

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
 * The external asset to preselect: the one the user picked while it still exists, else the
 * first one that can be minted, else the first one so the field is never empty.
 */
export function pickDefaultExternal(externals = [], selectedIndex) {
  if (!externals.length) {
    return null;
  }

  if (!isNil(selectedIndex)) {
    const selected = externals.find((item) => item.index === selectedIndex);

    if (selected) {
      return selected;
    }
  }

  return (
    externals.find((item) => item.status === "AllEnabled") ?? externals[0]
  );
}

function formatInternalAmount(value, decimals) {
  const places = Number.isInteger(decimals) && decimals > 0 ? decimals : 0;

  return new BigNumber(value?.toString() ?? 0)
    .dividedBy(new BigNumber(10).pow(places))
    .toString();
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
    const minimum = formatInternalAmount(minSwapAmount, internal.decimals);

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
