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
            roles: (roles && [roles]) || [],
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

export function useSortedPools({
  pools = [],
  myPoolId,
  sortedColumn,
  sortDirection,
}) {
  return useMemo(() => {
    const sorted = [...pools];

    if (sortedColumn) {
      sorted.sort((a, b) => {
        let aValue, bValue, diff;

        switch (sortedColumn) {
          case "Total Bonded":
            aValue = BigInt(a.points || 0);
            bValue = BigInt(b.points || 0);
            diff = bValue - aValue > 0n ? 1 : bValue - aValue < 0n ? -1 : 0;
            break;
          case "Members":
            aValue = a.memberCounter || 0;
            bValue = b.memberCounter || 0;
            diff = bValue - aValue;
            break;
          case "Commission":
            aValue = a.commission?.current?.[0] || 0;
            bValue = b.commission?.current?.[0] || 0;
            diff = bValue - aValue;
            break;
          default:
            diff = 0;
            break;
        }

        return sortDirection === "asc" ? -diff : diff;
      });
    } else {
      sorted.sort((a, b) => a.poolId - b.poolId);
    }

    if (myPoolId) {
      const myPoolIndex = sorted.findIndex(
        (pool) => Number(pool.poolId) === Number(myPoolId),
      );
      if (myPoolIndex > 0) {
        const [myPool] = sorted.splice(myPoolIndex, 1);
        sorted.unshift(myPool);
      }
    }

    return sorted;
  }, [pools, myPoolId, sortedColumn, sortDirection]);
}
