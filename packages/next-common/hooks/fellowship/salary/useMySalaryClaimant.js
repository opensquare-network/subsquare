import useRealAddress from "next-common/utils/hooks/useRealAddress";
import useSalaryClaimant from "./useSalaryClaimant";

export default function useMySalaryClaimant() {
  const address = useRealAddress();
  return useSalaryClaimant(address);
}
