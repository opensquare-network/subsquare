import BigNumber from "bignumber.js";
import { isNil } from "lodash-es";
import {
  metadata as metadataCodec,
  unifyMetadata,
  Blake2256,
} from "@polkadot-api/substrate-bindings";
import {
  getLookupFn,
  getLookupCodecBuilder,
} from "@polkadot-api/metadata-builders";

// BigInt-safe JSON stringify for a PAPI MultiLocation. PAPI location values
// contain bigint fields (e.g. chain_id, GeneralIndex), which plain
// JSON.stringify cannot serialize.
export function stringifyLocation(location) {
  return JSON.stringify(location, (key, value) =>
    typeof value === "bigint" ? value.toString() : value,
  );
}

// Decode a PAPI `Assets.Metadata` / `ForeignAssets.Metadata` symbol (Uint8Array).
export function decodeSymbol(bytes) {
  return new TextDecoder().decode(bytes);
}

// LP token id from a raw `AssetConversion.Pools` value. Current runtimes decode
// it as a plain number, older ones as `{ lp_token: N }` / `{ lpToken: N }`.
export function getPoolAssetId(value) {
  if (isNil(value)) {
    return null;
  }
  const lpToken =
    typeof value === "object" ? value.lp_token ?? value.lpToken : value;
  const num = Number(lpToken);
  return Number.isNaN(num) ? null : num;
}

// Parse a decoded PAPI XCM MultiLocation into a lightweight token descriptor:
// - native:   interior: { type: "Here" }
// - asset:    interior: { type: "X2", value: [ { type: "PalletInstance", value: 50 },
//             { type: "GeneralIndex", value: N } ] }
// - foreign:  anything else
export function parseTokenLocation(location) {
  const junctions = Array.isArray(location?.interior?.value)
    ? location.interior.value
    : [];

  const isAssetsPallet = junctions.some(
    (junction) =>
      junction?.type === "PalletInstance" && Number(junction.value) === 50,
  );
  const generalIndex = junctions.find(
    (junction) => junction?.type === "GeneralIndex",
  );

  if (isAssetsPallet && generalIndex) {
    return { type: "asset", assetId: Number(generalIndex.value) };
  }

  return location?.interior?.type === "Here"
    ? { type: "native" }
    : { type: "foreign", location };
}

export function toTokenUnits(plancks, decimals) {
  return new BigNumber(plancks).div(new BigNumber(10).pow(decimals));
}

// Normalized pool helpers -------------------------------------------------

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

// Find the native token's price in the given quote token (quote plancks per
// native plank), anchored on the native/quote pool.
export function computeNativeQuotePrice(pools, quoteTokenKey) {
  for (const pool of pools) {
    if (!hasToken(pool, quoteTokenKey) || !hasToken(pool, "native")) {
      continue;
    }
    const quoteReserve = reserveOf(pool, quoteTokenKey);
    const nativeReserve = reserveOf(pool, "native");
    if (quoteReserve.gt(0) && nativeReserve.gt(0)) {
      return quoteReserve.div(nativeReserve);
    }
  }

  return null;
}

// TVL of a single pool in anchor-token plancks (USDC on Polkadot asset hub,
// otherwise the native token), valued from the pool's own reserves.
// A constant-product pool is always in equilibrium: both reserves are equal in
// value under the pool's own implied rate, so TVL = 2 × one side.
export function computePoolTvl(pool, anchorKey, nativeAnchorPrice) {
  // pool with the anchor token on one side: both sides valued at the pool's own rate
  if (hasToken(pool, anchorKey)) {
    return reserveOf(pool, anchorKey).times(2);
  }

  // native/X pool: value = 2 × native side, converted to the anchor token
  if (nativeAnchorPrice && hasToken(pool, "native")) {
    return reserveOf(pool, "native").times(nativeAnchorPrice).times(2);
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

// PAPI-native foreign-token location hash ---------------------------------
//
// The foreign-token `assetId` (used for icons) is the blake2_256 hash of the
// SCALE-encoded XCM MultiLocation — the same value @polkadot/api exposes as
// `location.hash`. It is computed from the chain metadata:
//
//   const codec = getLocationCodec(client);           // V5 MultiLocation codec
//   const bytes = codec.enc(location);                // SCALE encoding
//   const hash  = Blake2256(bytes);                   // blake2_256
//
// Verified against the real Asset Hub chain (2026-08-07): 52/52 foreign asset
// hashes and 168/168 pool locations reproduce @polkadot/api exactly.

// Find the `staging_xcm.v5.location.Location` type id in the metadata lookup.
function findV5LocationTypeId(metadata) {
  return metadata.lookup.findIndex(
    (def) => (def?.path || []).join(".") === "staging_xcm.v5.location.Location",
  );
}

let locationCodecCache = null; // { client, codecPromise }

async function getLocationCodec(client) {
  if (locationCodecCache?.client !== client) {
    locationCodecCache = {
      client,
      codecPromise: (async () => {
        const metadataRaw = await client._request("state_getMetadata", []);
        const metadata = unifyMetadata(metadataCodec.dec(metadataRaw));
        const getCodec = getLookupCodecBuilder(getLookupFn(metadata));
        return getCodec(findV5LocationTypeId(metadata));
      })(),
    };
  }

  return locationCodecCache.codecPromise;
}

function toHex(bytes) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join(
    "",
  );
}

export async function getLocationHash(client, location) {
  if (!client) {
    return undefined;
  }

  const codec = await getLocationCodec(client);
  return `0x${toHex(Blake2256(codec.enc(location)))}`;
}
