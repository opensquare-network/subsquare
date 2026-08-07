import { useEffect, useMemo, useState } from "react";
import BigNumber from "bignumber.js";
import { isNil } from "lodash-es";
import { useAssetHubPapi } from "next-common/hooks/chain/useAssetHubApi";
import { getAssetHubPapiClient } from "next-common/utils/assetHub";
import { useAssetHubChain } from "next-common/hooks/useAssetHubChain";
import { useChainSettings } from "next-common/context/chain";
import Chains from "next-common/utils/consts/chains";
import {
  computeNativeQuotePrice,
  computePoolTvl,
  decodeSymbol,
  formatAmount,
  getLocationHash,
  getPoolAssetId,
  parseTokenLocation,
  stringifyLocation,
  toTokenUnits,
} from "./utils";

// USDC asset id used as the TVL anchor on Polkadot (relay or asset hub) only.
const USDC_ASSET_ID = 1337;

function normalizeToken(
  parsed,
  location,
  assetsMetadata,
  foreignAssetsMetadata,
  foreignLocationHashes,
  nativeSymbol,
  nativeDecimals,
) {
  if (parsed.type === "native") {
    return {
      type: "native",
      key: "native",
      symbol: nativeSymbol,
      decimals: nativeDecimals,
      hasName: true,
    };
  }

  if (parsed.type === "asset") {
    const meta = assetsMetadata.get(parsed.assetId) || {};
    return {
      type: "asset",
      key: `asset:${parsed.assetId}`,
      assetId: parsed.assetId,
      symbol: meta.symbol || `#${parsed.assetId}`,
      decimals: meta.decimals ?? 0,
      hasName: !!meta.symbol,
    };
  }

  const locationKey = stringifyLocation(location);
  const meta = foreignAssetsMetadata.get(locationKey) || {};
  return {
    type: "foreign",
    key: `foreign:${locationKey}`,
    // Location hash, same id used by the Foreign Assets tab for its icons.
    assetId: foreignLocationHashes.get(locationKey),
    location,
    symbol: meta.symbol || "Foreign",
    decimals: meta.decimals ?? 0,
    hasName: !!meta.symbol,
  };
}

function readReserveBalance(result, tokenType) {
  if (!result) {
    return new BigNumber(0);
  }

  if (tokenType === "native") {
    const free = new BigNumber(result.data.free.toString());
    const frozen = new BigNumber(result.data.frozen.toString());
    const available = free.minus(frozen);
    return available.isNegative() ? new BigNumber(0) : available;
  }

  const isLiquid = result.status?.type === "Liquid";
  if (!isLiquid) {
    return new BigNumber(0);
  }

  return new BigNumber(result.balance.toString());
}

// Fetch all chain entries the liquid pools list needs, in parallel.
async function fetchPoolEntries(papi) {
  const [
    poolsEntries,
    poolAssetsEntries,
    assetsMetadataEntries,
    foreignAssetsMetadataEntries,
  ] = await Promise.all([
    papi.query.AssetConversion.Pools.getEntries(),
    papi.query.PoolAssets.Asset.getEntries(),
    papi.query.Assets.Metadata.getEntries(),
    papi.query.ForeignAssets.Metadata.getEntries(),
  ]);

  return {
    poolsEntries,
    poolAssetsEntries,
    assetsMetadataEntries,
    foreignAssetsMetadataEntries,
  };
}

function buildAssetsMetadata(entries) {
  const map = new Map();
  entries.forEach(({ keyArgs, value }) => {
    map.set(Number(keyArgs[0]), {
      symbol: decodeSymbol(value.symbol),
      decimals: value.decimals ?? 0,
    });
  });
  return map;
}

function buildForeignAssetsMetadata(entries) {
  const map = new Map();
  entries.forEach(({ keyArgs, value }) => {
    map.set(stringifyLocation(keyArgs[0]), {
      symbol: decodeSymbol(value.symbol),
      decimals: value.decimals ?? 0,
    });
  });
  return map;
}

function buildPoolAssetMap(entries) {
  const map = new Map();
  entries.forEach(({ keyArgs, value }) => {
    map.set(Number(keyArgs[0]), {
      owner: value.owner,
      supply: value.supply?.toString?.() ?? "0",
    });
  });
  return map;
}

// Location hash of every registered foreign asset, used as the icon assetId
// for foreign tokens (matches the Foreign Assets tab).
async function buildForeignLocationHashes(foreignAssetsMetadataEntries) {
  const map = new Map();
  try {
    const client = await getAssetHubPapiClient();
    await Promise.all(
      foreignAssetsMetadataEntries.map(async ({ keyArgs }) => {
        const location = keyArgs[0];
        const hash = await getLocationHash(client, location);
        if (hash) {
          map.set(stringifyLocation(location), hash);
        }
      }),
    );
  } catch (e) {
    // Location hashes are only used for foreign token icons; fall back to
    // placeholder icons rather than failing the whole pools list.
    console.error("Failed to compute foreign token location hashes", e);
  }
  return map;
}

// Build the raw pool list, skipping pools with incomplete info (no owner or
// tokens without a registered on-chain symbol).
function buildPools(
  poolsEntries,
  {
    poolAssetMap,
    assetsMetadata,
    foreignAssetsMetadata,
    foreignLocationHashes,
    nativeSymbol,
    nativeDecimals,
  },
) {
  const pools = [];
  for (const { keyArgs, value } of poolsEntries) {
    const poolAssetId = getPoolAssetId(value);
    const poolAsset = poolAssetMap.get(poolAssetId);
    if (isNil(poolAssetId) || !poolAsset?.owner) {
      continue;
    }

    // PAPI keyArgs = [ [loc1, loc2] ]: the two MultiLocations in a single tuple.
    const [loc1, loc2] = keyArgs[0] ?? [];
    if (!loc1 || !loc2) {
      continue;
    }

    const token1 = normalizeToken(
      parseTokenLocation(loc1),
      loc1,
      assetsMetadata,
      foreignAssetsMetadata,
      foreignLocationHashes,
      nativeSymbol,
      nativeDecimals,
    );
    const token2 = normalizeToken(
      parseTokenLocation(loc2),
      loc2,
      assetsMetadata,
      foreignAssetsMetadata,
      foreignLocationHashes,
      nativeSymbol,
      nativeDecimals,
    );

    if (!token1.hasName || !token2.hasName) {
      continue;
    }

    pools.push({
      poolAssetId,
      owner: poolAsset.owner,
      supply: poolAsset.supply,
      token1,
      token2,
    });
  }

  return pools;
}

// Build the on-chain balance query for a single pool token, held in the pool
// vault's owner account.
function buildBalanceQuery(papi, token, owner) {
  if (token.type === "native") {
    return papi.query.System.Account.getValue(owner);
  }
  if (token.type === "asset") {
    return papi.query.Assets.Account.getValue(token.assetId, owner);
  }
  return papi.query.ForeignAssets.Account.getValue(token.location, owner);
}

// Fetch a single pool's reserve balances ([reserve1, reserve2]) as BigNumbers.
async function fetchPoolReserves(papi, pool) {
  const tokens = [pool.token1, pool.token2];
  const balanceResults = await Promise.all(
    tokens.map((token) => buildBalanceQuery(papi, token, pool.owner)),
  );

  return tokens.map((token, index) =>
    readReserveBalance(balanceResults[index], token.type),
  );
}

// Compare two pools by TVL (anchor-token plancks) descending; pools without a
// computable TVL sort last.
function compareTvlDesc(a, b, anchor) {
  const tvlA = computePoolTvl(a, anchor.tokenKey, anchor.nativeAnchorPrice);
  const tvlB = computePoolTvl(b, anchor.tokenKey, anchor.nativeAnchorPrice);

  if (!tvlA) {
    return 1;
  }
  if (!tvlB) {
    return -1;
  }
  if (tvlB.gt(tvlA)) {
    return 1;
  }
  if (tvlB.lt(tvlA)) {
    return -1;
  }
  return 0;
}

// Format a single pool into its display row: reserves and TVL (in the anchor
// token) in token units. The token pair price is computed at render time by the
// caller.
function formatPoolRow(pool, anchor) {
  const [reserve1, reserve2] = pool.reserves;

  const tvlPlancks = computePoolTvl(
    pool,
    anchor.tokenKey,
    anchor.nativeAnchorPrice,
  );

  const reserve1Units = toTokenUnits(reserve1, pool.token1.decimals);
  const reserve2Units = toTokenUnits(reserve2, pool.token2.decimals);

  return {
    ...pool,
    reserve1: formatAmount(reserve1Units),
    reserve2: formatAmount(reserve2Units),
    tvl: tvlPlancks
      ? formatAmount(toTokenUnits(tvlPlancks, anchor.decimals))
      : null,
    tvlSymbol: anchor.symbol,
  };
}

async function fetchLiquidPools(
  papi,
  { isUsdcAnchor, nativeSymbol, nativeDecimals },
) {
  const {
    poolsEntries,
    poolAssetsEntries,
    assetsMetadataEntries,
    foreignAssetsMetadataEntries,
  } = await fetchPoolEntries(papi);

  const assetsMetadata = buildAssetsMetadata(assetsMetadataEntries);
  const foreignAssetsMetadata = buildForeignAssetsMetadata(
    foreignAssetsMetadataEntries,
  );
  const poolAssetMap = buildPoolAssetMap(poolAssetsEntries);
  const foreignLocationHashes = await buildForeignLocationHashes(
    foreignAssetsMetadataEntries,
  );

  const pools = buildPools(poolsEntries, {
    poolAssetMap,
    assetsMetadata,
    foreignAssetsMetadata,
    foreignLocationHashes,
    nativeSymbol,
    nativeDecimals,
  });

  // Fetch each pool's reserves and assemble the pool with them.
  const poolsWithReserves = await Promise.all(
    pools.map(async (pool) => ({
      ...pool,
      reserves: await fetchPoolReserves(papi, pool),
    })),
  );

  // TVL anchor: USDC on Polkadot (relay or asset hub), native elsewhere.
  const anchor = isUsdcAnchor
    ? {
        tokenKey: `asset:${USDC_ASSET_ID}`,
        nativeAnchorPrice: computeNativeQuotePrice(
          poolsWithReserves,
          `asset:${USDC_ASSET_ID}`,
        ),
        symbol: "USDC",
        decimals: assetsMetadata.get(USDC_ASSET_ID)?.decimals ?? 6,
      }
    : {
        tokenKey: "native",
        nativeAnchorPrice: new BigNumber(1),
        symbol: nativeSymbol,
        decimals: nativeDecimals,
      };

  // Sort by TVL descending; pools without a computable TVL last.
  return [...poolsWithReserves]
    .sort((a, b) => compareTvlDesc(a, b, anchor))
    .map((pool) => formatPoolRow(pool, anchor));
}

export default function useLiquidPools() {
  const papi = useAssetHubPapi();
  const assetHubChain = useAssetHubChain();
  const { symbol: nativeSymbol, decimals: nativeDecimals } = useChainSettings();

  // TVL anchor: USDC on Polkadot (relay or asset hub), native elsewhere.
  const isUsdcAnchor = assetHubChain === Chains.polkadotAssetHub;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!papi) {
      return;
    }

    let cancelled = false;
    setLoading(true);

    fetchLiquidPools(papi, { isUsdcAnchor, nativeSymbol, nativeDecimals })
      .then((pools) => {
        if (!cancelled) {
          setData(pools);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch liquid pools", err);
        if (!cancelled) {
          setData([]);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [papi, isUsdcAnchor, nativeSymbol, nativeDecimals]);

  return useMemo(
    () => ({ data, loading, count: data?.length ?? 0 }),
    [data, loading],
  );
}
