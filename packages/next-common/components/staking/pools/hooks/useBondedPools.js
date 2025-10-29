import { useContextApi } from "next-common/context/api";
import { useEffect, useState } from "react";

export function useBondedPools() {
  const api = useContextApi();
  const [pools, setPools] = useState([]);

  useEffect(() => {
    if (!api || !api.query.nominationPools) {
      return;
    }

    api.query.nominationPools.bondedPools?.entries().then((pools) => {
      const normalizedPools = pools.map(([key, value]) => ({
        poolId: key.args[0].toString(),
        value: value.toJSON(),
      }));
      setPools(normalizedPools);
    });
  }, [api]);

  return { pools };
}
