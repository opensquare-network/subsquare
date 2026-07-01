import { useMemo } from "react";
import useQueryAllRecoveryAttempts from "next-common/components/data/recovery/hooks/useQueryAllRecoveryAttempts";

export default function useMyRecoveryAttempts(address) {
  const { data: attempts, loading, fetch } = useQueryAllRecoveryAttempts();

  const data = useMemo(() => {
    if (!address) return [];
    return attempts.filter((a) => a.lostAccount === address);
  }, [attempts, address]);

  return { data, loading, fetch };
}
