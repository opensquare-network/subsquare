import { useContextApi } from "next-common/context/api";
import { useCallback, useEffect, useState } from "react";

export default function useMinimumToCreatePool() {
  const api = useContextApi();
  const [minimum, setMiniMum] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMinimumAmount = useCallback(async () => {
    if (!api || !api.query?.nominationPools?.minCreateBond) {
      return;
    }

    try {
      const minimum = await api.query.nominationPools.minCreateBond();

      setMiniMum(minimum?.toJSON());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    fetchMinimumAmount();
  }, [fetchMinimumAmount]);

  return {
    minimum: minimum ?? 0,
    loading,
  };
}
