import { useContextApi } from "next-common/context/api";
import { useCallback, useEffect, useState } from "react";

export default function useMinimumToJoinPool() {
  const api = useContextApi();
  const [minimum, setMiniMum] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMinimumAmount = useCallback(async () => {
    if (!api || !api.query?.nominationPools?.minJoinBond) {
      return;
    }

    try {
      const minimum = await api.query.nominationPools.minJoinBond();

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
