import { SYMBOL_DECIMALS } from "next-common/utils/consts/asset";

// AssetHub asset generalIndex to symbol mapping
const ASSET_HUB_GENERAL_INDEX_SYMBOL = {
  1984: "USDT",
  1337: "USDC",
};

/**
 * Extract symbol from raw assetKind stored by the scanner.
 * assetKind format: { v3/v5: { location: {...}, assetId: { .../concrete: { interior: { x2: [{ palletInstance: 50 }, { generalIndex: N }] } } } } }
 * Returns null for native assets or unrecognized assetKind.
 */
export function getAssetSymbolFromAssetKind(assetKind) {
  if (!assetKind) return null;

  // Try each version key (v3, v4, v5)
  const versionedData =
    assetKind.v5 || assetKind.v4 || assetKind.v3 || assetKind;

  // assetId can be under "assetId" (v5) or "assetId.concrete" (v3)
  const assetId = versionedData?.assetId;
  if (!assetId) return null;

  const interior =
    assetId?.interior || assetId?.concrete?.interior || assetId?.abstract;
  if (!interior) return null;

  // x2 is an array of two items: [{ palletInstance: 50 }, { generalIndex: N }]
  const x2 = interior?.x2;
  if (!x2 || !Array.isArray(x2)) return null;

  const palletInstance = x2.find((item) => item?.palletInstance !== undefined);
  const generalIndexItem = x2.find((item) => item?.generalIndex !== undefined);

  if (palletInstance?.palletInstance === 50 && generalIndexItem) {
    const generalIndex = generalIndexItem.generalIndex;
    return ASSET_HUB_GENERAL_INDEX_SYMBOL[generalIndex] || null;
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
