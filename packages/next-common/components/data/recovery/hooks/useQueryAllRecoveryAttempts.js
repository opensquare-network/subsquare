import useRecoveryAttemptsData from "next-common/components/recovery/common/hooks/useRecoveryAttemptsData";

export default function useQueryAllRecoveryAttempts() {
  const { attempts, loading } = useRecoveryAttemptsData();
  return { data: attempts, loading };
}
