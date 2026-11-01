import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import useLiquidPools from "../../liquidPools/useLiquidPools";
import { getDirectTokens, getUniqueTokens } from "../utils";

function getDefaultPair(pools) {
  const defaultPool = pools[0];
  if (!defaultPool) {
    return { inKey: null, outKey: null };
  }
  const { token1, token2 } = defaultPool;
  if (token2.key === "native") {
    return { inKey: token2.key, outKey: token1.key };
  }
  return { inKey: token1.key, outKey: token2.key };
}

// A link into the swap tab can name the pair it wants open, e.g. the liquidity pool rows link
// `/assets?tab=swap&tokenIn=native&tokenOut=asset:7873`. The pair is only used when it is a
// direct pool, so a stale link falls back to the default one.
function getLinkedPair(pools, tokenInKey, tokenOutKey) {
  if (!tokenInKey || !tokenOutKey) {
    return null;
  }

  const pool = pools.find(
    (item) =>
      (item.token1.key === tokenInKey && item.token2.key === tokenOutKey) ||
      (item.token1.key === tokenOutKey && item.token2.key === tokenInKey),
  );
  if (!pool) {
    return null;
  }

  return { inKey: tokenInKey, outKey: tokenOutKey };
}

function buildTokenIndex(pools) {
  const map = new Map();
  pools.forEach((pool) => {
    map.set(pool.token1.key, pool.token1);
    map.set(pool.token2.key, pool.token2);
  });
  return map;
}

function pickCompatibleKey(pools, anchorKey, currentKey) {
  const options = getDirectTokens(pools, anchorKey);
  if (options.some((token) => token.key === currentKey)) {
    return currentKey;
  }
  return options[0]?.key ?? null;
}

export default function useSwapPools() {
  const router = useRouter();
  const { data, loading } = useLiquidPools();
  const pools = useMemo(() => data ?? [], [data]);
  const [pair, setPair] = useState({ inKey: null, outKey: null });
  const linkedTokenIn =
    typeof router.query.tokenIn === "string" ? router.query.tokenIn : null;
  const linkedTokenOut =
    typeof router.query.tokenOut === "string" ? router.query.tokenOut : null;

  useEffect(() => {
    setPair((current) => {
      if (current.inKey) {
        return current;
      }
      return (
        getLinkedPair(pools, linkedTokenIn, linkedTokenOut) ??
        getDefaultPair(pools)
      );
    });
  }, [pools, linkedTokenIn, linkedTokenOut]);

  const tokenIndex = useMemo(() => buildTokenIndex(pools), [pools]);
  const tokenIn = tokenIndex.get(pair.inKey) ?? null;
  const tokenOut = tokenIndex.get(pair.outKey) ?? null;

  const tokenOptions = useMemo(() => getUniqueTokens(pools), [pools]);

  const setTokenIn = useCallback(
    (nextToken) => {
      setPair((current) => ({
        inKey: nextToken.key,
        outKey: pickCompatibleKey(pools, nextToken.key, current.outKey),
      }));
    },
    [pools],
  );

  const setTokenOut = useCallback(
    (nextToken) => {
      setPair((current) => ({
        inKey: pickCompatibleKey(pools, nextToken.key, current.inKey),
        outKey: nextToken.key,
      }));
    },
    [pools],
  );

  const reversePair = useCallback(() => {
    setPair((current) => ({ inKey: current.outKey, outKey: current.inKey }));
  }, []);

  return {
    loading,
    reversePair,
    setTokenIn,
    setTokenOut,
    tokenIn,
    tokenOptions,
    tokenOut,
  };
}
