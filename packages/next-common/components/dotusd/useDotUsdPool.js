import { useEffect, useState } from "react";
import { useChainSettings } from "next-common/context/chain";
import { getAssetHubPapi } from "next-common/utils/assetHub";
import {
  buildBalanceQuery,
  readReserveBalance,
} from "next-common/components/assethubMigrationAssets/liquidPools/useLiquidPools";
import {
  decodeSymbol,
  getPoolAssetId,
  parseTokenLocation,
  toTokenUnits,
} from "next-common/components/assethubMigrationAssets/liquidPools/utils";

// dotUSD is a local Asset Hub asset, and the other side of its pool is the native token.
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

  return null;
}

/**
 * Reads the DOT/dotUSD pool of the Hub DEX from the chain itself: the pool entry names the lp
 * token, the pool account holds the two reserves, and the pallet constant is the lp fee. The
 * reserves are the balances of the pool account, and the price is the dotUSD side over the
 * DOT one, both scaled to token units.
 */
export async function fetchDotUsdPool(api, { dotSymbol, dotDecimals }) {
  const poolEntries = await api.query.AssetConversion.Pools.getEntries();

  const entry = poolEntries.find(({ keyArgs }) => {
    const tokens = (keyArgs[0] ?? []).map(tokenOf);

    return (
      tokens.some((token) => token?.type === "native") &&
      tokens.some((token) => token?.key === DOTUSD_KEY)
    );
  });

  if (!entry) {
    return null;
  }

  const tokens = (entry.keyArgs[0] ?? []).map(tokenOf);
  const native = tokens.find((token) => token?.type === "native");
  const dotusd = tokens.find((token) => token?.key === DOTUSD_KEY);
  const poolAsset = await api.query.PoolAssets.Asset.getValue(
    getPoolAssetId(entry.value),
  );
  const owner = poolAsset?.owner;
  if (!owner) {
    return null;
  }

  const [nativeAccount, dotusdAccount, dotusdMetadata, lpFee] =
    await Promise.all([
      buildBalanceQuery(api, native, owner),
      buildBalanceQuery(api, dotusd, owner),
      api.query.Assets.Metadata.getValue(DOTUSD_ASSET_ID),
      api.constants.AssetConversion.LPFee(),
    ]);

  const dotReserve = toTokenUnits(
    readReserveBalance(nativeAccount, native.type),
    dotDecimals,
  );
  const dotUsdSymbol = decodeSymbol(dotusdMetadata?.symbol) || "dotUSD";
  const dotUsdDecimals = dotusdMetadata?.decimals ?? 0;
  const dotUsdReserve = toTokenUnits(
    readReserveBalance(dotusdAccount, dotusd.type),
    dotUsdDecimals,
  );

  const price = dotReserve.gt(0) ? dotUsdReserve.dividedBy(dotReserve) : null;
  const tvl = price ? dotReserve.multipliedBy(price).plus(dotUsdReserve) : null;

  return {
    dotUsdKey: DOTUSD_KEY,
    dotSymbol,
    dotUsdSymbol,
    dotReserve,
    dotUsdReserve,
    price,
    tvl,
    lpFee,
  };
}

export default function useDotUsdPool() {
  const { symbol: dotSymbol, decimals: dotDecimals } = useChainSettings();
  const [state, setState] = useState({ pool: null, isLoading: true });

  useEffect(() => {
    let isMounted = true;

    getAssetHubPapi()
      .then((api) => fetchDotUsdPool(api, { dotSymbol, dotDecimals }))
      .then((pool) => {
        if (isMounted) {
          setState({ pool, isLoading: false });
        }
      })
      .catch((error) => {
        console.error("Failed to fetch the dotUSD pool", error);

        if (isMounted) {
          setState({ pool: null, isLoading: false });
        }
      });

    return () => {
      isMounted = false;
    };
  }, [dotSymbol, dotDecimals]);

  return state;
}
