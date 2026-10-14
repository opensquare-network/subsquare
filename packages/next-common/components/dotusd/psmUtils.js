import BigNumber from "bignumber.js";
import { u8aToString } from "@polkadot/util";
import { isNil } from "lodash-es";

// PSM storage keys are XCM locations. Asset Hub local assets are referenced as
// `(PalletInstance 50, GeneralIndex <asset id>)`, we only need that index to read the
// asset metadata and to display it.
export function assetIndexFromLocation(location) {
  const junctions = location?.interior?.value ?? [];
  const generalIndex = junctions.find((item) => item?.type === "GeneralIndex");

  if (isNil(generalIndex?.value)) {
    return null;
  }

  return Number(generalIndex.value);
}

export function symbolOf(metadata) {
  const symbol = metadata?.symbol;

  if (!symbol) {
    return null;
  }

  // Asset metadata stores the symbol as raw bytes.
  return typeof symbol === "string" ? symbol : u8aToString(Uint8Array.from(symbol));
}

// Permill is parts per million: 1_000_000 = 100%
export function permillToPercent(value) {
  return new BigNumber(value?.toString() ?? 0).dividedBy(10_000);
}

export function permillRange(entries) {
  if (!entries?.length) {
    return null;
  }

  const percents = entries.map((entry) => permillToPercent(entry.value));

  return {
    min: BigNumber.min(...percents),
    max: BigNumber.max(...percents),
  };
}

// PAPI decodes XCM location junction values (e.g. GeneralIndex) as BigInt, and the
// location popup serialises the object to JSON, which throws on BigInt. Convert them to
// strings so the object matches what the rest of the app passes around.
export function toJsonSafe(value) {
  if (typeof value === "bigint") {
    return value.toString();
  }

  if (Array.isArray(value)) {
    return value.map(toJsonSafe);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, toJsonSafe(item)]),
    );
  }

  return value;
}

export function sumValues(entries) {
  return entries.reduce(
    (sum, entry) => sum.plus(entry.value?.toString() ?? 0),
    new BigNumber(0),
  );
}

// `PsmAdminInfo.full_admin` / `emergency_admin` hold a `PalletsOrigin`, decoded by PAPI as
// a nested enum: `{ type, value }`, e.g. `system::RawOrigin::Root` (Root) or a custom one
// such as `Origins::ProsperityEmergency`. Governance origins have no account, signed ones do.
export function parsePalletsOrigin(origin) {
  if (!origin?.type) {
    return null;
  }

  const inner = origin.value;

  if (inner?.type === "Signed") {
    const account =
      typeof inner.value === "string" ? inner.value : inner.value?.value;

    if (typeof account === "string") {
      return { type: "account", account };
    }
  }

  return {
    type: "origin",
    label: [origin.type, inner?.type].filter(Boolean).join(" · "),
  };
}

export function formatPercent(value, maxDecimals = 4) {
  if (isNil(value)) {
    return null;
  }

  return `${new BigNumber(value).toFixed(maxDecimals).replace(/\.?0+$/, "")}%`;
}

/**
 * Each external's cap is its share of the instance ceiling: the weight normalised against
 * the sum of weights of the same instance, times `max_debt`. A zero weight blocks minting.
 */
export function computeEffectiveCaps(maxDebt, weights) {
  const totalWeight = weights.reduce(
    (sum, weight) => sum.plus(weight ?? 0),
    new BigNumber(0),
  );

  if (isNil(maxDebt) || totalWeight.lte(0)) {
    return weights.map(() => null);
  }

  return weights.map((weight) =>
    new BigNumber(maxDebt).multipliedBy(weight ?? 0).dividedBy(totalWeight),
  );
}

export function utilizationPercent(debt, cap) {
  if (isNil(debt) || isNil(cap) || BigNumber(cap).lte(0)) {
    return null;
  }

  return new BigNumber(debt).dividedBy(cap).multipliedBy(100);
}

/**
 * Assembles the page data from the raw PSM storage entries. Kept pure (no api access) so
 * the assembly itself is covered by tests; the hook only performs the reads.
 */
export function buildPsmData({
  psmEntries = [],
  externalEntries = [],
  weightEntries = [],
  debtEntries = [],
  feeEntries = [],
  redemptionEntries = [],
  adminEntries = [],
  assetMetadata = new Map(),
} = {}) {
  if (!psmEntries.length) {
    return null;
  }

  const [{ keyArgs, value: instance }] = psmEntries;
  // BigInt junction values would break the JSON serialisation in the location popup.
  const internalLocation = toJsonSafe(keyArgs?.[0] ?? null);
  const internalIndex = assetIndexFromLocation(internalLocation);
  const maxDebt = instance?.max_debt?.toString();
  const internalMetadata = assetMetadata.get(internalIndex) ?? null;

  // The per-pair maps are keyed by (internal, external); keep this instance's entries only.
  const belongsToInstance = (entry) =>
    assetIndexFromLocation(entry.keyArgs?.[0]) === internalIndex;
  const byExternalAsset = (entries) =>
    new Map(
      entries
        .filter(belongsToInstance)
        .map((entry) => [
          assetIndexFromLocation(entry.keyArgs?.[1]),
          entry.value,
        ]),
    );

  const weights = byExternalAsset(weightEntries);
  const debts = byExternalAsset(debtEntries);
  const mintingFees = byExternalAsset(feeEntries);
  const redemptionFees = byExternalAsset(redemptionEntries);

  const pairs = externalEntries.filter(belongsToInstance).map((entry) => {
    const index = assetIndexFromLocation(entry.keyArgs?.[1]);

    return {
      index,
      location: toJsonSafe(entry.keyArgs?.[1] ?? null),
      status: entry.value?.status?.type ?? null,
      decimals: entry.value?.decimals ?? 0,
      weight: weights.get(index) ?? null,
      // The debt is minted in internal asset units, i.e. dotUSD.
      debt: debts.get(index)?.toString() ?? "0",
      mintingFee: mintingFees.get(index),
      redemptionFee: redemptionFees.get(index),
    };
  });

  const caps = computeEffectiveCaps(
    maxDebt,
    pairs.map((pair) => pair.weight),
  );
  const adminEntry = adminEntries.find(belongsToInstance);

  const externals = pairs.map((pair, index) => {
    const metadata = assetMetadata.get(pair.index) ?? null;
    const utilization = utilizationPercent(pair.debt, caps[index]);

    return {
      ...pair,
      symbol: symbolOf(metadata) ?? `Asset ${pair.index}`,
      decimals: metadata?.decimals ?? pair.decimals,
      cap: isNil(caps[index]) ? null : caps[index].toFixed(0),
      utilization: isNil(utilization) ? null : utilization.toFixed(2),
      mintingFee: permillToPercent(pair.mintingFee),
      // Kept raw alongside the display percent: psm.mint and psm.redeem take their max_fee as a
      // Permill and the chain compares it against these exact values, so neither may round-trip
      // through a float.
      mintingFeePermill: isNil(pair.mintingFee) ? null : Number(pair.mintingFee),
      redemptionFee: permillToPercent(pair.redemptionFee),
      redemptionFeePermill: isNil(pair.redemptionFee)
        ? null
        : Number(pair.redemptionFee),
    };
  });

  return {
    fullAdmin: parsePalletsOrigin(adminEntry?.value?.full_admin),
    emergencyAdmin: parsePalletsOrigin(adminEntry?.value?.emergency_admin),
    internalAsset: {
      index: internalIndex,
      location: internalLocation,
      symbol: symbolOf(internalMetadata) ?? "dotUSD",
      decimals: internalMetadata?.decimals ?? instance?.internal_decimals ?? 0,
    },
    maxDebt,
    minSwapAmount: instance?.min_swap_amount?.toString(),
    feeDestination: isNil(instance?.fee_destination)
      ? null
      : String(instance.fee_destination),
    externalCount: Number(instance?.external_count ?? 0),
    totalDebt: sumValues(debtEntries.filter(belongsToInstance)).toString(),
    mintingFee: permillRange(feeEntries.filter(belongsToInstance)),
    redemptionFee: permillRange(redemptionEntries.filter(belongsToInstance)),
    externals,
  };
}

// ---------------------------------------------------------------------------------------------
// Shared by both swap directions. The PSM's `mint` and `redeem` take the same location and
// Permill arguments and are validated against the same asset, so these live here rather than
// in either direction's module.

// Asset Hub references its own assets as the XCM location `(PalletInstance 50, GeneralIndex
// <asset id>)`.
export const ASSETS_PALLET_INSTANCE = 50;

// Permill is parts per million: 1_000_000 = 100%.
export const PERMILL_UNIT = 1_000_000;

// Floor for the max fee a swap is willing to accept, in Permill parts: 1_000 = 0.1%. See
// resolveMaxFeePermill for why it is a floor rather than a fixed value.
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
 * Builds the location `mint` and `redeem` expect for an Asset Hub local asset. The page reads
 * PSM locations through papi, which decodes them as `{ interior: { type, value } }`; polkadot-js
 * cannot encode that shape (it fails with `failed decoding psm.mint`), it wants
 * `{ interior: { X2: [...] } }`.
 *
 * Building it from the asset id rather than converting the decoded object is deliberate: the
 * result is the exact inverse of assetIndexFromLocation, it has one possible output per id, and
 * it cannot silently turn an unfamiliar location into a *different* valid one. Whether the
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
 * The `max_fee` to send with a swap. The pallet rejects the call outright when the pair's
 * configured fee is above it (`FeeTooHigh`), so a hardcoded constant would block the swap the
 * day governance raises the fee past it. Flooring the pair's own fee keeps the value valid and
 * still bounded, and it stays meaningful as a protection: the user is never signing a blank
 * cheque on the fee.
 */
export function resolveMaxFeePermill(feePermill) {
  const fee = Number(feePermill ?? 0);

  if (!Number.isFinite(fee) || fee < 0) {
    return MIN_MAX_FEE_PERMILL;
  }

  return Math.max(fee, MIN_MAX_FEE_PERMILL);
}

/**
 * Parses an amount field into planck, for whichever side of the swap the user is typing.
 * `isEmpty` is kept apart from `error` so a blank field can be reported as "enter an amount"
 * rather than "invalid amount".
 */
export function parseAssetAmount(value, decimals = 0) {
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

export function toBigIntOrNull(value) {
  if (isNil(value) || value === "") {
    return null;
  }

  try {
    return BigInt(value);
  } catch {
    return null;
  }
}

export function formatAssetAmount(value, decimals) {
  const places = Number.isInteger(decimals) && decimals > 0 ? decimals : 0;

  return new BigNumber(value?.toString() ?? 0)
    .dividedBy(new BigNumber(10).pow(places))
    .toString();
}

/**
 * The external asset to preselect: the one the user picked while it still exists, else the
 * first one that can be swapped, else the first one so the field is never empty.
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
