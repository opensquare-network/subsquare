import { useContextApi } from "next-common/context/api";
import { useEffect, useState } from "react";

export function useBondedPools() {
  const api = useContextApi();
  const [loading, setLoading] = useState(true);
  const [pools, setPools] = useState([]);

  useEffect(() => {
    if (!api || !api.query.nominationPools) {
      return;
    }

    api.query.nominationPools.bondedPools
      ?.entries()
      .then((pools) => {
        const normalizedPools = pools
          .map(([key, value]) => {
            const poolId = key.args[0].toString();
            const valueData = value.toJSON() || {};
            const { roles, ...rest } = valueData;
            return {
              poolId,
              ...rest,
              roles: [roles] || [],
            };
          })
          .sort((a, b) => a.poolId - b.poolId);
        setPools(normalizedPools);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [api]);

  return { pools, loading };
}
