import { useCallback, useState, useEffect } from "react";
import { useHydrationApi } from "next-common/hooks/ecoAssets/hydration/context/hydrationSDKContext";
import BigNumber from "bignumber.js";

export default function useTotalIssuances() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const api = useHydrationApi();

  const fetchTotalIssuances = useCallback(async () => {
    if (!api) {
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.query.tokens.totalIssuance.entries();

      const issuances = new Map(
        res.map(([key, rawData]) => [
          key.args[0].toString(),
          new BigNumber(rawData.toString()),
        ]),
      );
      setData(issuances);
    } catch (error) {
      console.error("Failed to fetch total issuances", error);
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  useEffect(() => {
    fetchTotalIssuances();
  }, [fetchTotalIssuances]);

  return { data, isLoading };
}
