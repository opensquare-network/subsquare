import { createContext, useContext } from "react";
import { useFellowshipSalaryStats } from "next-common/hooks/fellowship/salary/useFellowshipSalaryStats";

export const SalaryStatsContext = createContext({});

export default function SalaryStatsProvider({ children }) {
  const salaryStats = useFellowshipSalaryStats();

  return (
    <SalaryStatsContext.Provider value={salaryStats}>
      {children}
    </SalaryStatsContext.Provider>
  );
}

export function useContextSalaryStats() {
  return useContext(SalaryStatsContext);
}
