import { useMemo } from "react";
import useQueryAllRecoveryInheritors from "next-common/components/data/recovery/hooks/useQueryAllRecoveryInheritors";

export default function useInheritedAccounts(address) {
  const { data: allData, loading, fetch } = useQueryAllRecoveryInheritors();

  const data = useMemo(() => {
    if (!address) return [];
    return allData.filter(
      (item) => item.inheritor?.toLowerCase() === address?.toLowerCase(),
    );
  }, [allData, address]);

  return { data, loading, fetch };
}
