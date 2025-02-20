import { useContextSalaryStats } from "../salaryStats";
import { useIsInSalaryRegistrationPeriod } from "next-common/hooks/fellowship/salary/useIsInSalaryRegistrationPeriod";

export default function useIsSalaryRegistrationOpening() {
  const salaryStats = useContextSalaryStats();
  return useIsInSalaryRegistrationPeriod(salaryStats);
}
