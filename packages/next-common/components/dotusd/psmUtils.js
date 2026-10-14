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
      // Kept raw alongside the display percent: psm.mint takes its max_fee as a Permill and the
      // chain compares it against this exact value, so it must not round-trip through a float.
      mintingFeePermill: isNil(pair.mintingFee) ? null : Number(pair.mintingFee),
      redemptionFee: permillToPercent(pair.redemptionFee),
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
