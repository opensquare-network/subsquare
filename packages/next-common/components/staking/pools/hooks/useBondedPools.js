import { useContextApi } from "next-common/context/api";
import { useEffect, useState, useMemo } from "react";

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
        const normalizedPools = pools.map(([key, value]) => {
          const poolId = key.args[0].toString();
          const valueData = value.toJSON() || {};
          const { roles, ...rest } = valueData;
          return {
            poolId,
            ...rest,
            roles: [roles] || [],
          };
        });
        setPools(normalizedPools);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [api]);

  return { pools, loading };
}

export function useSortedPools({ pools = [], myPoolId }) {
  return useMemo(() => {
    return pools.sort((a, b) => {
      if (myPoolId && Number(a.poolId) === Number(myPoolId)) {
        return -1;
      } else if (myPoolId && Number(b.poolId) === Number(myPoolId)) {
        return 1;
      }
      return a.poolId - b.poolId;
    });
  }, [pools, myPoolId]);
}
