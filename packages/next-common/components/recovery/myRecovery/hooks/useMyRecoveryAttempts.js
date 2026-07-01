import { useMemo } from "react";
import useRecoveryAttemptsData from "next-common/components/recovery/common/hooks/useRecoveryAttemptsData";

export default function useMyRecoveryAttempts(address) {
  const { attempts, loading, fetch } = useRecoveryAttemptsData();

  const data = useMemo(() => {
    if (!address) return [];
    return attempts.filter((a) => a.lostAccount === address);
  }, [attempts, address]);

  return { data, loading, fetch };
}
