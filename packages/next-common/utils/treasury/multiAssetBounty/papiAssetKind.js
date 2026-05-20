import { ASSET_HUB_GENERAL_INDEX_SYMBOL } from "next-common/asset";
import { SYMBOL_DECIMALS } from "next-common/utils/consts/asset";
import { isNil } from "lodash-es";

const ASSET_HUB_PARACHAIN_ID = 1000;
const ASSET_HUB_PALLET_INSTANCE = 50;

function papiGetJunctions(interior) {
  if (!interior) {
    return null;
  }
  if (interior === "Here" || interior?.type === "Here") {
    return [];
  }
  const { type, value } = interior;
  if (!type || value == null) {
    return null;
  }
  return Array.isArray(value) ? value : [value];
}

function papiIsAssetHubLocation(location) {
  if (!location) {
    return false;
  }
  const junctions = papiGetJunctions(location.interior);
  if (junctions === null) {
    return false;
  }
  if (junctions.length === 0) {
    return true;
  }
  return junctions.some(
    (j) =>
      j?.type === "Parachain" && Number(j?.value) === ASSET_HUB_PARACHAIN_ID,
  );
}

function papiGetSymbolFromAssetId(assetId) {
  const junctions = papiGetJunctions(assetId?.interior);
  if (!junctions?.length) {
    return null;
  }
  const palletInstance = junctions.find(
    (j) => j?.type === "PalletInstance",
  )?.value;
  const generalIndex = junctions.find((j) => j?.type === "GeneralIndex")?.value;
  if (
    Number(palletInstance) === ASSET_HUB_PALLET_INSTANCE &&
    !isNil(generalIndex)
  ) {
    return ASSET_HUB_GENERAL_INDEX_SYMBOL[String(generalIndex)] ?? null;
  }
  return null;
}

export function getAssetInfoFromPapiAssetKind(
  papiAssetKind,
  chainDecimals,
  chainSymbol,
) {
  if (!papiAssetKind) {
    return { symbol: chainSymbol, decimals: chainDecimals };
  }
  // papi format: { type: "V5", value: { location, asset_id } }
  const inner = papiAssetKind?.value ?? papiAssetKind;
  const { location, asset_id: assetId } = inner ?? {};
  if (!papiIsAssetHubLocation(location)) {
    return { symbol: chainSymbol, decimals: chainDecimals };
  }
  const symbol = papiGetSymbolFromAssetId(assetId);
  if (!symbol) {
    return { symbol: chainSymbol, decimals: chainDecimals };
  }
  const decimals = SYMBOL_DECIMALS[symbol] ?? chainDecimals;
  return { symbol, decimals };
}
