import { isNil } from "lodash-es";
import { ASSET_HUB_GENERAL_INDEX_SYMBOL } from "next-common/asset";
import { SYMBOL_DECIMALS } from "next-common/utils/consts/asset";
import Chains from "next-common/utils/consts/chains";

const ASSET_HUB_PARACHAIN_ID = "1000";
const POLKADOT_DOT_SYMBOL = "DOT";

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

  if (interior === "here") {
    return [];
  }

  if (interior.here !== undefined) {
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

  if (isNil(junctions)) {
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

function isPolkadotGlobalConsensus(junction) {
  return junction?.globalConsensus?.polkadot !== undefined;
}

function isPolkadotConsensusHere(location) {
  if (normalizeNumberish(location?.parents) !== "2") {
    return false;
  }

  const junctions = getLocationJunctions(location);
  return junctions?.length === 1 && isPolkadotGlobalConsensus(junctions[0]);
}

export function getAssetSymbolFromAssetKind(assetKind) {
  if (!assetKind) {
    return null;
  }

  const versionedData = getVersionedAssetData(assetKind);
  const locationJunctions = getLocationJunctions(versionedData?.location);
  const isLocalLocation =
    Array.isArray(locationJunctions) && locationJunctions.length === 0;

  const isAssetHubLocation =
    isLocalLocation ||
    locationJunctions?.some((junction) => {
      const parachainId = junction?.parachain;
      return normalizeNumberish(parachainId) === ASSET_HUB_PARACHAIN_ID;
    });

  if (!isAssetHubLocation) {
    return null;
  }

  const assetIdLocation = getAssetIdLocation(versionedData);
  if (
    process.env.NEXT_PUBLIC_CHAIN === Chains.kusama &&
    isPolkadotConsensusHere(assetIdLocation)
  ) {
    return POLKADOT_DOT_SYMBOL;
  }

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

export function getAssetDecimalsFromAssetKind(assetKind, chainDecimals) {
  const symbol = getAssetSymbolFromAssetKind(assetKind);
  if (symbol && SYMBOL_DECIMALS[symbol] !== undefined) {
    return SYMBOL_DECIMALS[symbol];
  }
  return chainDecimals;
}

export function getAssetInfoFromAssetKind(
  assetKind,
  chainDecimals,
  chainSymbol,
) {
  const symbol = getAssetSymbolFromAssetKind(assetKind) || chainSymbol;
  const decimals = getAssetDecimalsFromAssetKind(assetKind, chainDecimals);
  return { symbol, decimals };
}
