import { isNil } from "lodash-es";
import {
  buildBalanceQuery,
  decodeSymbol,
  getLocationHash,
  getPoolAssetId,
  parseTokenLocation,
  readReserveBalance,
  stringifyLocation,
  toTokenUnits,
} from "next-common/components/assethubMigrationAssets/liquidPools/utils";

// dotUSD is a local Asset Hub asset. The swap tab addresses local assets by id, so its key is
// the same string used by the pool rows there.
const DOTUSD_ASSET_ID = 7873;
const DOTUSD_KEY = `asset:${DOTUSD_ASSET_ID}`;

function tokenOf(location) {
  const parsed = parseTokenLocation(location);

  if (parsed.type === "native") {
    return { type: "native", key: "native", location };
  }

  if (parsed.type === "asset") {
    return {
      type: "asset",
      key: `asset:${parsed.assetId}`,
      assetId: parsed.assetId,
      location,
    };
  }

  return {
    type: "foreign",
    key: `foreign:${stringifyLocation(location)}`,
    location,
  };
}

function readSymbol(metadata, fallback) {
  const symbol = decodeSymbol(metadata?.symbol)?.trim();

  return symbol || fallback;
}

async function readTokenMetadata(api, token) {
  try {
    if (token.type === "asset") {
      return await api.query.Assets.Metadata.getValue(token.assetId);
    }
    if (token.type === "foreign") {
      return await api.query.ForeignAssets.Metadata.getValue(token.location);
    }
  } catch (error) {
    console.warn("Failed to read token metadata", error);
  }

  return null;
}

async function describeToken(api, token, nativeToken) {
  if (token.type === "native") {
    return { ...token, ...nativeToken };
  }

  const metadata = await readTokenMetadata(api, token);
  const fallback =
    token.type === "asset"
      ? token.key === DOTUSD_KEY
        ? "dotUSD"
        : `#${token.assetId}`
      : "Foreign";

  return {
    ...token,
    symbol: readSymbol(metadata, fallback),
    decimals: metadata?.decimals ?? 0,
  };
}

async function withForeignIcon(token, clientPromise) {
  if (token.type !== "foreign" || !clientPromise) {
    return token;
  }

  try {
    const client = await clientPromise;
    const assetId = client
      ? await getLocationHash(client, token.location)
      : undefined;

    return assetId ? { ...token, assetId } : token;
  } catch (error) {
    console.warn("Failed to compute foreign token location hash", error);
    return token;
  }
}

/**
 * Reads every Hub DEX pool that holds dotUSD, one row per pair: the pool entry names the token
 * pair and the lp token, the pool account holds the two reserves, and the pallet constant is
 * the lp fee. The price is the dotUSD reserve over the other token's reserve, both scaled to
 * token units, and the tvl values both reserves in dotUSD.
 *
 * `clientPromise` is only used to resolve icons of foreign tokens, and may be omitted by
 * callers that do not need them.
 */
export async function fetchDotUsdPools(
  api,
  { dotSymbol, dotDecimals, clientPromise },
) {
  const [entries, lpFee] = await Promise.all([
    api.query.AssetConversion.Pools.getEntries(),
    api.constants.AssetConversion.LPFee(),
  ]);

  const dotUsdPools = entries
    .map((entry) => ({
      value: entry.value,
      tokens: (Array.isArray(entry.keyArgs?.[0]) ? entry.keyArgs[0] : []).map(
        tokenOf,
      ),
    }))
    .filter(({ tokens }) => tokens.some((token) => token.key === DOTUSD_KEY));

  if (!dotUsdPools.length) {
    return [];
  }

  const nativeToken = { symbol: dotSymbol, decimals: dotDecimals };

  const rows = await Promise.all(
    dotUsdPools.map(async ({ value, tokens }) => {
      const poolAssetId = getPoolAssetId(value);
      if (isNil(poolAssetId)) {
        return null;
      }

      const poolAsset = await api.query.PoolAssets.Asset.getValue(poolAssetId);
      const owner = poolAsset?.owner;
      if (!owner) {
        return null;
      }

      // Keep the reserve order stable ("token / dotUSD") whatever order the chain stored.
      const dotUsdIndex = tokens.findIndex((token) => token.key === DOTUSD_KEY);
      const otherIndex = dotUsdIndex === 0 ? 1 : 0;
      const dotUsdToken = tokens[dotUsdIndex];
      const otherToken = tokens[otherIndex];

      const [other, dotUsd, otherAccount, dotUsdAccount] = await Promise.all([
        describeToken(api, otherToken, nativeToken),
        describeToken(api, dotUsdToken, nativeToken),
        buildBalanceQuery(api, otherToken, owner),
        buildBalanceQuery(api, dotUsdToken, owner),
      ]);

      const otherReserve = toTokenUnits(
        readReserveBalance(otherAccount, otherToken.type),
        other.decimals,
      );
      const dotUsdReserve = toTokenUnits(
        readReserveBalance(dotUsdAccount, dotUsdToken.type),
        dotUsd.decimals,
      );
      const price = otherReserve.gt(0)
        ? dotUsdReserve.dividedBy(otherReserve)
        : null;

      const [otherWithIcon, dotUsdWithIcon] = await Promise.all([
        withForeignIcon(other, clientPromise),
        withForeignIcon(dotUsd, clientPromise),
      ]);

      return {
        poolAssetId,
        otherToken: otherWithIcon,
        dotUsdToken: dotUsdWithIcon,
        otherReserve,
        dotUsdReserve,
        price,
        // A constant product pool is always in equilibrium, so both reserves are worth the
        // dotUSD side at the pool's own price.
        tvl: dotUsdReserve.multipliedBy(2),
        lpFee,
      };
    }),
  );

  return rows.filter(Boolean).sort((a, b) => b.tvl.comparedTo(a.tvl));
}
