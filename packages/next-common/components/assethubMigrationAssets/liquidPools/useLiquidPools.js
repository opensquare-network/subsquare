import { useEffect, useMemo, useState } from "react";
import BigNumber from "bignumber.js";
import { isNil } from "lodash-es";
import { useAssetHubApi } from "next-common/hooks/chain/useAssetHubApi";
import { useAssetHubChain } from "next-common/hooks/useAssetHubChain";
import { useChainSettings } from "next-common/context/chain";
import Chains from "next-common/utils/consts/chains";
import {
  computeNativeUsdtPrice,
  computePoolTvl,
  formatAmount,
  formatPrice,
  getLocationPair,
  getPoolAssetId,
  parseTokenLocation,
  toTokenUnits,
} from "./utils";

// USDT asset id used as the TVL anchor on each Asset Hub.
// All main Asset Hubs mint USDT as local asset 1984.
const USDT_ASSET_IDS = {
  [Chains.polkadotAssetHub]: 1984,
  [Chains.kusamaAssetHub]: 1984,
  [Chains.westendAssetHub]: 1984,
  [Chains.paseoAssetHub]: 1984,
};

function normalizeToken(
  parsed,
  locationCodec,
  assetsMetadata,
  foreignAssetsMetadata,
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

  const locationKey = JSON.stringify(parsed.location);
  const meta = foreignAssetsMetadata.get(locationKey) || {};
  return {
    type: "foreign",
    key: `foreign:${locationKey}`,
    // Location hash, same id used by the Foreign Assets tab for its icons.
    assetId: locationCodec?.hash?.toString?.(),
    location: parsed.location,
    locationCodec,
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

  if (result.isNone) {
    return new BigNumber(0);
  }

  const account = result.unwrap();
  const isLiquid =
    account.status?.isLiquid || account.status?.toString?.() === "Liquid";
  if (!isLiquid) {
    return new BigNumber(0);
  }

  return new BigNumber(account.balance.toString());
}

async function fetchLiquidPools(
  api,
  { usdtAssetId, nativeSymbol, nativeDecimals },
) {
  const [
    poolsEntries,
    poolAssetsEntries,
    assetsMetadataEntries,
    foreignAssetsMetadataEntries,
  ] = await Promise.all([
    api.query.assetConversion.pools.entries(),
    api.query.poolAssets.asset.entries(),
    api.query.assets.metadata.entries(),
    api.query.foreignAssets.metadata.entries(),
  ]);

  const assetsMetadata = new Map();
  assetsMetadataEntries.forEach(([key, value]) => {
    assetsMetadata.set(Number(key.args[0]), {
      symbol: value.symbol?.toHuman?.() ?? value.symbol?.toString?.() ?? "",
      decimals: value.decimals?.toNumber?.() ?? value.decimals ?? 0,
    });
  });

  const foreignAssetsMetadata = new Map();
  foreignAssetsMetadataEntries.forEach(([key, value]) => {
    foreignAssetsMetadata.set(JSON.stringify(key.args[0].toJSON()), {
      symbol: value.symbol?.toHuman?.() ?? value.symbol?.toString?.() ?? "",
      decimals: value.decimals?.toNumber?.() ?? value.decimals ?? 0,
    });
  });

  const poolAssetMap = new Map();
  poolAssetsEntries.forEach(([key, value]) => {
    // Read via toJSON(): on current runtimes the decoded struct does not expose
    // its fields as direct codec properties (value.owner is undefined).
    const json = value.toJSON?.() ?? value;
    poolAssetMap.set(Number(key.args[0]), {
      owner: json.owner?.toString?.(),
      supply: json.supply?.toString?.() ?? "0",
    });
  });

  const pools = [];
  for (const [key, value] of poolsEntries) {
    const poolAssetId = getPoolAssetId(value);
    const poolAsset = poolAssetMap.get(poolAssetId);
    if (isNil(poolAssetId) || !poolAsset?.owner) {
      continue;
    }

    const tuple = key.args;
    const [loc1, loc2] = getLocationPair(tuple) ?? [];
    if (!loc1 || !loc2) {
      continue;
    }

    const token1 = normalizeToken(
      parseTokenLocation(loc1.toJSON()),
      loc1,
      assetsMetadata,
      foreignAssetsMetadata,
      nativeSymbol,
      nativeDecimals,
    );
    const token2 = normalizeToken(
      parseTokenLocation(loc2.toJSON()),
      loc2,
      assetsMetadata,
      foreignAssetsMetadata,
      nativeSymbol,
      nativeDecimals,
    );

    // Skip pools whose tokens have no registered symbol on chain (incomplete info).
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

  // fetch reserves (owner balances), batched in a single queryMulti
  const balanceRequests = [];
  pools.forEach((pool) => {
    [pool.token1, pool.token2].forEach((token) => {
      if (token.type === "native") {
        balanceRequests.push([api.query.system.account, pool.owner]);
      } else if (token.type === "asset") {
        balanceRequests.push([
          api.query.assets.account,
          [token.assetId, pool.owner],
        ]);
      } else {
        balanceRequests.push([
          api.query.foreignAssets.account,
          [token.locationCodec, pool.owner],
        ]);
      }
    });
  });

  const balanceResults = balanceRequests.length
    ? await api.queryMulti(balanceRequests)
    : [];
  let balanceIdx = 0;
  pools.forEach((pool) => {
    pool.reserves = [pool.token1, pool.token2].map((token) =>
      readReserveBalance(balanceResults[balanceIdx++], token.type),
    );
  });

  // TVL (in USDT), valued from each pool's own reserves
  const usdtTokenKey = `asset:${usdtAssetId}`;
  const nativeUsdtPrice = computeNativeUsdtPrice(pools, usdtTokenKey);

  // Sort by TVL (USDT plancks) descending; pools without a computable TVL last.
  const sortedPools = [...pools].sort((a, b) => {
    const tvlA = computePoolTvl(a, usdtTokenKey, nativeUsdtPrice);
    const tvlB = computePoolTvl(b, usdtTokenKey, nativeUsdtPrice);
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
  });

  return sortedPools.map((pool) => {
    const [reserve1, reserve2] = pool.reserves;

    const tvlPlancks = computePoolTvl(pool, usdtTokenKey, nativeUsdtPrice);

    const reserve1Units = toTokenUnits(reserve1, pool.token1.decimals);
    const reserve2Units = toTokenUnits(reserve2, pool.token2.decimals);

    // 1 token1 = X token2 (and the inverted direction)
    const price = reserve1Units.gt(0) ? reserve2Units.div(reserve1Units) : null;
    const invertedPrice = reserve2Units.gt(0)
      ? reserve1Units.div(reserve2Units)
      : null;

    return {
      ...pool,
      reserve1: formatAmount(reserve1Units),
      reserve2: formatAmount(reserve2Units),
      tvl: tvlPlancks ? formatAmount(toTokenUnits(tvlPlancks, 6)) : null,
      price: formatPrice(price),
      invertedPrice: formatPrice(invertedPrice),
    };
  });
}

export default function useLiquidPools() {
  const api = useAssetHubApi();
  // useChain() returns the relay chain (e.g. "polkadot"), while USDT_ASSET_IDS is
  // keyed by asset hub chain ids (e.g. "polkadot-assethub") - map first.
  const assetHubChain = useAssetHubChain();
  const { symbol: nativeSymbol, decimals: nativeDecimals } = useChainSettings();
  const usdtAssetId = USDT_ASSET_IDS[assetHubChain];

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!api) {
      return;
    }

    if (isNil(usdtAssetId)) {
      setData([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    fetchLiquidPools(api, { usdtAssetId, nativeSymbol, nativeDecimals })
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
  }, [api, usdtAssetId, nativeSymbol, nativeDecimals]);

  return useMemo(
    () => ({ data, loading, count: data?.length ?? 0 }),
    [data, loading],
  );
}
