import { useSalaryFellowshipPallet } from "next-common/context/collectives/collectives";
import { useStorage } from "next-common/hooks/common/useStorage";
import { useEffect } from "react";
import { createGlobalState } from "react-use";

const useCachedStats = createGlobalState({});

export function useFellowshipSalaryStats() {
  const pallet = useSalaryFellowshipPallet();
  const [cachedStats, setCachedStats] = useCachedStats();

  const stats = cachedStats[pallet];

  const { result: rawOptional } = useStorage(pallet, "status", [], {
    subscribe: true,
  });

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
