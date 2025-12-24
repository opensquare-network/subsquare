import { useContextApi } from "next-common/context/api";
import { useCallback, useEffect, useState } from "react";

export default function useMaxValidatorsCount() {
  const api = useContextApi();
  const [maxCount, setMaxCount] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchActiveCount = useCallback(async () => {
    if (!api || !api.query.staking?.maxValidatorsCount) {
      return;
    }

    try {
      const count = await api.query.staking.maxValidatorsCount();

      setMaxCount(count?.toJSON());
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
    maxCount: maxCount ?? 0,
    loading,
  };
}
