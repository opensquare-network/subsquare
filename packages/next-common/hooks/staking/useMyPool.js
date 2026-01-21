import { useMemo } from "react";
import { useMyPool } from "next-common/context/staking/myPool";
import { useActiveEra } from "next-common/context/staking/activeEra";
import { isNil } from "lodash-es";

export function useMyPoolBalance(myPool) {
  const { activeEraIndex, loading } = useActiveEra();

  return useMemo(() => {
    if (!myPool || loading || isNil(activeEraIndex)) {
      return null;
    }
    const active = BigInt(myPool.points);
    const unbonding = Object.entries(myPool.unbondingEras).map(
      ([era, value]) => ({
        era: Number(era),
        value: BigInt(value),
      }),
    );
    let unlocking = 0n;
    let unlocked = 0n;
    const unlockingEntries = [];
    for (const { era, value } of unbonding) {
      if (era <= activeEraIndex) {
        unlocked += value;
      } else {
        unlocking += value;
        unlockingEntries.push({ era, value });
      }
    }
    return {
      active,
      unlocking,
      unlockingEntries,
      unlocked,
    };
  }, [myPool, activeEraIndex, loading]);
}

export function useMyPoolInfo() {
  const { poolMember, loading } = useMyPool();
  const balances = useMyPoolBalance(poolMember);

  return {
    myPool: poolMember,
    balances,
    loading,
  };
}
