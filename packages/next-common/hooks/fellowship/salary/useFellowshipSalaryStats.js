import { useSalaryFellowshipPallet } from "next-common/context/collectives/collectives";
import useSubStorage from "next-common/hooks/common/useSubStorage";
import { useEffect } from "react";
import { createGlobalState } from "react-use";

const useCachedStats = createGlobalState({});

export function useFellowshipSalaryStats() {
  const pallet = useSalaryFellowshipPallet();
  const [cachedStats, setCachedStats] = useCachedStats();

  const stats = cachedStats[pallet];

  const { result: rawOptional } = useSubStorage(pallet, "status");

  useEffect(() => {
    if (rawOptional?.isSome) {
      setCachedStats({
        ...cachedStats,
        [pallet]: rawOptional.unwrap().toJSON(),
      });
    }
  }, [rawOptional, pallet]);

  return stats;
}
