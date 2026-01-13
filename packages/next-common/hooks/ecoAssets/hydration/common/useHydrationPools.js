import { useCallback, useState, useEffect } from "react";
import { HUB_ID, TYPE_MAPPING } from "../utils";
import { getTargetTypePools } from "../utils/assetUtils";
import { useHydrationSDK } from "next-common/hooks/ecoAssets/hydration/context/hydrationSDKContext";

export function useOmniPoolTokens() {
  const sdk = useHydrationSDK();
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
      pools?.forEach((pool) => {
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
