import useMySalaryClaimant from "next-common/hooks/fellowship/salary/useMySalaryClaimant";

const { createContext, useContext } = require("react");

const MySalaryClaimantContext = createContext(null);

export function MySalaryClaimantProvider({ children }) {
  const { claimant, isLoading } = useMySalaryClaimant();

  return (
    <MySalaryClaimantContext.Provider value={{ claimant, isLoading }}>
      {children}
    </MySalaryClaimantContext.Provider>
  );
}

export function useMySalaryClaimantFromContext() {
  return useContext(MySalaryClaimantContext);
}
