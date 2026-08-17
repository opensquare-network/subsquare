import { isNil } from "lodash-es";

const ASSETS_PALLET_INSTANCE = 50;

function getForeignLocationKey(locationHash) {
  if (!locationHash) {
    return null;
  }
  return `foreign:${locationHash.toLowerCase()}`;
}

export function getSwapLocationKey(token) {
  if (!token) {
    return null;
  }
  if (token.type === "native") {
    return "native";
  }
  if (token.type === "foreign") {
    return getForeignLocationKey(token.assetId);
  }
  return token.key;
}

function getLocalLocationKey(location) {
  const interior = location?.interior;
  if (!interior) {
    return null;
  }

  const parents = Number(location.parents);
  const isHere = typeof interior === "object" && "here" in interior;

  // Asset Hub represents its relay-chain native token as Parent/Here.
  // Keep local Here support for runtimes that encode native currency locally.
  if (isHere && (parents === 0 || parents === 1)) {
    return "native";
  }

  if (parents !== 0) {
    return null;
  }

  const [pallet, asset] = interior.x2 ?? [];
  const isAssetsPallet =
    Number(pallet?.palletInstance) === ASSETS_PALLET_INSTANCE;
  const assetId = asset?.generalIndex;
  if (isAssetsPallet && !isNil(assetId)) {
    return `asset:${Number(assetId)}`;
  }

  return null;
}

export function getPolkadotLocationKey(location, locationHash) {
  if (!location?.interior) {
    return null;
  }

  const localLocationKey = getLocalLocationKey(location);
  if (localLocationKey) {
    return localLocationKey;
  }

  return getForeignLocationKey(locationHash);
}

export function buildPoolLocations(entries) {
  const locations = new Map();
  entries.forEach(([storageKey]) => {
    const [pair] = storageKey.args;
    const [rawLocA, rawLocB] = pair;
    const locA = rawLocA.toJSON();
    const locB = rawLocB.toJSON();
    const keyA = getPolkadotLocationKey(locA, rawLocA.hash.toHex());
    const keyB = getPolkadotLocationKey(locB, rawLocB.hash.toHex());
    if (!keyA || !keyB) {
      return;
    }

    const isANative = keyA === "native";
    const isBNative = keyB === "native";
    if (isANative === isBNative) {
      return;
    }

    const tokenKey = isANative ? keyB : keyA;
    locations.set(tokenKey, {
      nativeLocation: isANative ? locA : locB,
      tokenLocation: isANative ? locB : locA,
    });
  });
  return locations;
}
