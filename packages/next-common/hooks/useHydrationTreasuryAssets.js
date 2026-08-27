import { useCallback, useEffect, useState } from "react";
import useAllAssets from "next-common/hooks/ecoAssets/hydration/common/useAllAssets";
import {
  useHydrationApi,
  useHydrationSDK,
} from "next-common/hooks/ecoAssets/hydration/context/hydrationSDKContext";
import { fetchHydrationTreasuryPortfolio } from "next-common/hooks/hydrationTreasuryAssets/portfolio";

export const HYDRATION_TREASURY_ACCOUNT =
  "7L53bUTBopuwFt3mKUfmkzgGLayYa1Yvn1hAg9v5UMrQzTfh";

export default function useHydrationTreasuryAssets() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const sdk = useHydrationSDK();
  const api = useHydrationApi();
  const { allAssets, loading: allAssetsLoading } = useAllAssets();
  const { ctx } = sdk ?? {};

  const fetchData = useCallback(
    async (isCancelled) => {
      if (allAssetsLoading || !ctx || !sdk || !api) return;

      setIsLoading(true);
      try {
        const portfolio = await fetchHydrationTreasuryPortfolio({
          sdk,
          api,
          allAssets,
          address: HYDRATION_TREASURY_ACCOUNT,
        });
        if (!isCancelled()) setData(portfolio);
      } catch (error) {
        if (!isCancelled()) {
          console.error("Error fetching hydration treasury assets:", error);
        }
      } finally {
        if (!isCancelled()) setIsLoading(false);
      }
    },
    [allAssets, allAssetsLoading, api, ctx, sdk],
  );

  useEffect(() => {
    let cancelled = false;
    fetchData(() => cancelled);

    return () => {
      cancelled = true;
    };
  }, [fetchData]);

  return { data, isLoading };
}
