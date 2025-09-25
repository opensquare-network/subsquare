import { createSdkContext } from "@galacticcouncil/sdk";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { useCallback, useState, useEffect } from "react";
import { HUB_ID } from "../utils";

const TYPE_MAPPING = {
  aave: "Aave",
  xyk: "Xyk",
  omnipool: "Omnipool",
  stableswap: "Stableswap",
  hsm: "Hsm",
};

//  Hydration SDK in provider?
const ws = "wss://rpc.hydradx.cloud";
const wsProvider = new WsProvider(ws, 2_500, {}, 60_000, 102400, 10 * 60_000);

const api = await ApiPromise.create({
  provider: wsProvider,
});

const sdk = await createSdkContext(api);

async function getTargetTypePools(api, type) {
  const pools = await api.router.getPools();
  if (!pools) {
    return [];
  }

  return pools.filter((pool) => pool.type === type);
}

export function useXYKSDKPools() {
  const { api } = sdk ?? {};
  const [pools, setPools] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPools = useCallback(async () => {
    if (!api) {
      return null;
    }

    try {
      setIsLoading(true);
      const pools = await getTargetTypePools(api, TYPE_MAPPING.xyk);
      setPools(pools);
    } catch (error) {
      console.error("Error fetching XYK pools:", error);
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  useEffect(() => {
    fetchPools();
  }, [fetchPools]);

  return { data: pools, isLoading };
}

export function useOmniPoolTokens() {
  const { api } = sdk ?? {};
  const [pools, setPools] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPools = useCallback(async () => {
    if (!api) {
      return null;
    }

    try {
      setIsLoading(true);
      let omnipoolTokens = [];
      const pools = await getTargetTypePools(api, TYPE_MAPPING.omnipool);
      pools?.map((pool) => {
        const tokens = pool?.tokens ?? [];
        for (const tokenRaw of tokens) {
          const token = {
            ...tokenRaw,
            shares: tokenRaw.shares?.toString(),
            protocolShares: tokenRaw.protocolShares?.toString(),
            cap: tokenRaw.cap?.toString(),
            hubReserves: tokenRaw.hubReserves?.toString(),
          };

          if (token.id !== HUB_ID) {
            const {
              id,
              hubReserves,
              cap,
              protocolShares,
              shares,
              tradeable,
              balance,
            } = token;

            omnipoolTokens.push({
              id,
              hubReserve: hubReserves,
              cap,
              protocolShares,
              shares,
              bits: tradeable,
              balance,
            });
          }
        }
      });

      setPools(omnipoolTokens);
    } catch (error) {
      console.error("Error fetching XYK pools:", error);
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  useEffect(() => {
    fetchPools();
  }, [fetchPools]);

  return { data: pools, isLoading };
}
