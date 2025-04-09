import { createContext, useContext } from "react";
import useMySalaryClaimant from "next-common/hooks/fellowship/salary/useMySalaryClaimant";

export const MySalaryClaimantContext = createContext({});

export default function MySalaryClaimantProvider({ children }) {
  const { claimant, isLoading } = useMySalaryClaimant();

  return (
    <MySalaryClaimantContext.Provider value={{ claimant, isLoading }}>
      {children}
    </MySalaryClaimantContext.Provider>
  );
}

export function useContextMySalaryClaimant() {
  return useContext(MySalaryClaimantContext);
}
