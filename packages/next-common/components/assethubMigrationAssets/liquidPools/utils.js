import BigNumber from "bignumber.js";
import { isNil } from "lodash-es";

// Normalize the LP token id from a raw `AssetConversion.Pools` value.
// Newer runtimes decode it as `{ lp_token: 35 }` / `{ lpToken: 35 }`,
// older ones as a plain number. Read from toJSON() because struct codecs do
// not always expose the field as a direct property.
export function getPoolAssetId(value) {
  if (isNil(value)) {
    return null;
  }

  const json = typeof value.toJSON === "function" ? value.toJSON() : value;

  if (json && typeof json === "object") {
    const lpToken = json.lp_token ?? json.lpToken;
    if (!isNil(lpToken)) {
      return Number(lpToken);
    }
  }

  const num = Number(json);
  return Number.isNaN(num) ? null : num;
}

// Case-insensitive key lookup. @polkadot/api toJSON() currently emits enum/struct
// keys in lowercase (e.g. `here`, `palletInstance`, `generalIndex`), but has
// historically used capitalized variants - match both.
function findKey(obj, name) {
  if (!obj || typeof obj !== "object") {
    return null;
  }
  const lower = name.toLowerCase();
  return Object.keys(obj).find((key) => key.toLowerCase() === lower) ?? null;
}

// Parse a decoded XCM MultiLocation (JSON form) into a lightweight token descriptor.
// - native:   { parents: 1, interior: { here: null } }
// - asset:    { parents: 0, interior: { x2: [ { palletInstance: 50 }, { generalIndex: "318" } ] } }
// - foreign:  anything else
export function parseTokenLocation(locationJson) {
  const interior = locationJson?.interior;

  if (typeof interior === "string") {
    return interior.toLowerCase() === "here"
      ? { type: "native" }
      : { type: "foreign", location: locationJson };
  }

  if (interior && typeof interior === "object") {
    // native: { interior: { here: null } }
    if (findKey(interior, "here") !== null) {
      return { type: "native" };
    }

    const junctions = Object.values(interior)[0];
    if (Array.isArray(junctions)) {
      const isAssetsPallet = junctions.some((junction) => {
        const key = findKey(junction, "PalletInstance");
        return key !== null && Number(junction[key]) === 50;
      });
      const generalIndex = junctions.find(
        (junction) => findKey(junction, "GeneralIndex") !== null,
      );

      if (isAssetsPallet && generalIndex) {
        const key = findKey(generalIndex, "GeneralIndex");
        return { type: "asset", assetId: Number(generalIndex[key]) };
      }
    }
  }

  return { type: "foreign", location: locationJson };
}

export function toTokenUnits(plancks, decimals) {
  return new BigNumber(plancks).div(new BigNumber(10).pow(decimals));
}

// Extract the two MultiLocation codecs from a storage key of the
// `AssetConversion.Pools` map. Different @polkadot/api versions expose the
// tuple key either flattened (`key.args = [loc1, loc2]`) or nested
// (`key.args = [tuple(loc1, loc2)]`).
export function getLocationPair(args) {
  const first = args?.[0];
  const second = args?.[1];

  if (first && second) {
    return [first, second];
  }

  if (first && (first[0] || first[1])) {
    return [first[0], first[1]];
  }

  return null;
}

// Normalized pool helpers -------------------------------------------------

export function getTokenKey(token) {
  if (token.type === "native") {
    return "native";
  }
  if (token.type === "asset") {
    return `asset:${token.assetId}`;
  }
  return `foreign:${JSON.stringify(token.location)}`;
}

export function hasToken(pool, tokenKey) {
  return pool.token1.key === tokenKey || pool.token2.key === tokenKey;
}

export function reserveOf(pool, tokenKey) {
  if (pool.token1.key === tokenKey) {
    return pool.reserves[0];
  }
  if (pool.token2.key === tokenKey) {
    return pool.reserves[1];
  }
  return new BigNumber(0);
}

// Find the native token's price in USDT (USDT plancks per native plank),
// anchored on the native/USDT pool.
export function computeNativeUsdtPrice(pools, usdtTokenKey) {
  for (const pool of pools) {
    if (!hasToken(pool, usdtTokenKey) || !hasToken(pool, "native")) {
      continue;
    }
    const usdtReserve = reserveOf(pool, usdtTokenKey);
    const nativeReserve = reserveOf(pool, "native");
    if (usdtReserve.gt(0) && nativeReserve.gt(0)) {
      return usdtReserve.div(nativeReserve);
    }
  }

  return null;
}

// TVL of a single pool in USDT plancks, valued from the pool's own reserves.
// A constant-product pool is always in equilibrium: both reserves are equal in
// value under the pool's own implied rate, so TVL = 2 × one side.
export function computePoolTvl(pool, usdtTokenKey, nativeUsdtPrice) {
  // pool with USDT on one side: both sides are valued at the pool's own rate
  if (hasToken(pool, usdtTokenKey)) {
    return reserveOf(pool, usdtTokenKey).times(2);
  }

  // native/X pool: value = 2 × native side, converted to USDT
  if (nativeUsdtPrice && hasToken(pool, "native")) {
    return reserveOf(pool, "native").times(nativeUsdtPrice).times(2);
  }

  return null;
}

// Display formatting helpers ---------------------------------------------

export function formatAmount(value, maxDecimals = 6) {
  if (isNil(value)) {
    return null;
  }

  const bn = new BigNumber(value);
  if (bn.isNaN() || !bn.isFinite()) {
    return null;
  }
  if (bn.isZero()) {
    return "0";
  }

  const decimals = bn.abs().lt(0.001) ? 10 : maxDecimals;
  return bn.toFixed(decimals).replace(/\.?0+$/, "");
}

export function formatPrice(value) {
  if (isNil(value)) {
    return null;
  }

  const bn = new BigNumber(value);
  if (bn.isNaN() || !bn.isFinite() || bn.isZero()) {
    return null;
  }

  if (bn.abs().gte(1e6)) {
    return bn.toFixed(2).replace(/\.?0+$/, "");
  }
  if (bn.abs().lt(1e-6)) {
    return bn.toFixed(10).replace(/\.?0+$/, "");
  }
  return bn.toPrecision(6).replace(/\.?0+$/, "");
}
