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
