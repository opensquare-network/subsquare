import useRealAddress from "next-common/utils/hooks/useRealAddress";
import useSubStorage from "../common/useSubStorage";
import { useMemo } from "react";
import { useActiveEra } from "./useActiveEra";

export function useMyPool() {
  const realAddress = useRealAddress();
  const { activeEra } = useActiveEra();
  const { result, loading } = useSubStorage("nominationPools", "poolMembers", [
    realAddress,
  ]);
  const myPool = result?.toJSON();
  const balances = useMemo(() => {
    if (!myPool) {
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

  return {
    myPool,
    balances,
    loading,
  };
}
