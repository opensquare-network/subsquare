import { useContextApi } from "next-common/context/api";
import { useCallback, useEffect, useState } from "react";

export default function useActivePoolsCount() {
  const api = useContextApi();
  const [activeCount, setActiveCount] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchActiveCount = useCallback(async () => {
    if (!api || !api.query?.nominationPools?.counterForBondedPools) {
      return;
    }

    try {
      const count = await api.query.nominationPools.counterForBondedPools();

      setActiveCount(count?.toJSON());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    fetchActiveCount();
  }, [fetchActiveCount]);

  return {
    activeCount: activeCount ?? 0,
    loading,
  };
}
