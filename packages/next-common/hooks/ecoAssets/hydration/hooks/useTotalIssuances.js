import { useCallback, useState, useEffect } from "react";
import { useHydrationApi } from "next-common/hooks/chain/useHydrationApi";

export default function useTotalIssuances() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const api = useHydrationApi();

  const fetchTotalIssuances = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.query.tokens.totalIssuance.entries();
      const issuances = new Map(
        res.map(([key, rawData]) => [
          key.args[0].toString(),
          rawData.toBigNumber(),
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
    if (!api) {
      return;
    }
    fetchTotalIssuances();
  }, [fetchTotalIssuances, api]);

  return { data, isLoading };
}
