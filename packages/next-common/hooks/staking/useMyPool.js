import { useMemo } from "react";
import { useActiveEra } from "./useActiveEra";
import { useMyPool } from "next-common/components/staking/pools/context/myPool";

export function useMyPoolBalance(myPool) {
  const { activeEra } = useActiveEra();

  return useMemo(() => {
    if (!myPool || !activeEra) {
      return null;
    }
    const active = BigInt(myPool.points);
    const unbonding = Object.entries(myPool.unbondingEras).map(
      ([era, value]) => ({
        era,
        value: BigInt(value),
      }),
    );
    let unlocking = 0n;
    let unlocked = 0n;
    for (const { era, value } of unbonding) {
      if (activeEra && era <= activeEra.index) {
        unlocked += value;
      } else {
        unlocking += value;
      }
    }
    return {
      active,
      unlocking,
      unlocked,
    };
  }, [myPool, activeEra]);
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
