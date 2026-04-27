import { SYMBOL_DECIMALS } from "next-common/utils/consts/asset";

// AssetHub asset generalIndex to symbol mapping
const ASSET_HUB_GENERAL_INDEX_SYMBOL = {
  1984: "USDT",
  1337: "USDC",
};

const ASSET_HUB_PARACHAIN_ID = "1000";

function normalizeNumberish(value) {
  if (value === null || value === undefined) {
    return null;
  }

  return String(value);
}

function getVersionedAssetData(assetKind) {
  return assetKind?.v5 || assetKind?.v4 || assetKind?.v3 || assetKind;
}

function getLocationJunctions(location) {
  const interior = location?.interior;
  if (!interior) {
    return null;
  }

  if (interior === "here" || interior === "Here") {
    return [];
  }

  if (interior.here !== undefined || interior.Here !== undefined) {
    return [];
  }

  const junctionKey = Object.keys(interior).find((key) => /^x\d+$/i.test(key));
  if (!junctionKey) {
    return null;
  }

  const junctions = interior[junctionKey];
  if (Array.isArray(junctions)) {
    return junctions;
  }

  if (junctions === null || junctions === undefined) {
    return null;
  }

  return [junctions];
}

function getAssetIdLocation(versionedData) {
  const assetId = versionedData?.assetId;
  if (!assetId) {
    return null;
  }

  if (assetId?.interior) {
    return assetId;
  }

  if (assetId?.concrete?.interior) {
    return assetId.concrete;
  }

  return null;
}

/**
 * Extract symbol from raw assetKind stored by the scanner.
 * Scanner persists polkadot.js `.toJSON()` for `VersionedLocatableAsset`, so
 * the current shape here is `{ v3|v4|v5: { location, assetId } }` with
 * lowercase-starting junction keys such as `parachain`, `palletInstance` and
 * `generalIndex`.
 * Returns null for native assets or unrecognized assetKind.
 */
export function getAssetSymbolFromAssetKind(assetKind) {
  if (!assetKind) return null;

  const versionedData = getVersionedAssetData(assetKind);
  const locationJunctions = getLocationJunctions(versionedData?.location);
  const isAssetHubLocation = locationJunctions?.some((junction) => {
    const parachainId = junction?.parachain;
    return normalizeNumberish(parachainId) === ASSET_HUB_PARACHAIN_ID;
  });

  if (!isAssetHubLocation) {
    return null;
  }

  const assetIdLocation = getAssetIdLocation(versionedData);
  const assetIdJunctions = getLocationJunctions(assetIdLocation);
  if (!assetIdJunctions?.length) {
    return null;
  }

  const palletInstanceJunction = assetIdJunctions.find(
    (junction) => junction?.palletInstance !== undefined,
  );
  const generalIndexJunction = assetIdJunctions.find(
    (junction) => junction?.generalIndex !== undefined,
  );

  const palletInstance = palletInstanceJunction?.palletInstance;
  if (normalizeNumberish(palletInstance) === "50" && generalIndexJunction) {
    const generalIndex = generalIndexJunction.generalIndex;
    return (
      ASSET_HUB_GENERAL_INDEX_SYMBOL[normalizeNumberish(generalIndex)] || null
    );
  }

  return null;
}

/**
 * Get decimals for the asset represented by assetKind.
 * Falls back to chain decimals if native.
 */
export function getAssetDecimalsFromAssetKind(assetKind, chainDecimals) {
  const symbol = getAssetSymbolFromAssetKind(assetKind);
  if (symbol && SYMBOL_DECIMALS[symbol] !== undefined) {
    return SYMBOL_DECIMALS[symbol];
  }
  return chainDecimals;
}

/**
 * Returns { symbol, decimals } for the given assetKind.
 */
export function getAssetInfoFromAssetKind(
  assetKind,
  chainDecimals,
  chainSymbol,
) {
  const symbol = getAssetSymbolFromAssetKind(assetKind) || chainSymbol;
  const decimals = getAssetDecimalsFromAssetKind(assetKind, chainDecimals);
  return { symbol, decimals };
}
