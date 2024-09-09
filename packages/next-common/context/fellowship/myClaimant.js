import useMySalaryClaimant from "next-common/hooks/fellowship/salary/useMySalaryClaimant";
import useSubMyCoreMember from "next-common/hooks/fellowship/core/useSubMyCoreMember";
import { createContext, useContext } from "react";

const MySalaryClaimantContext = createContext(null);

export function MySalaryClaimantProvider({ children }) {
  const { claimant, isLoading: isLoadingClaimant } = useMySalaryClaimant();
  const { member, isLoading: isLoadingMember } = useSubMyCoreMember();

  return (
    <MySalaryClaimantContext.Provider
      value={{
        claimant,
        member,
        isLoading: isLoadingClaimant || isLoadingMember,
      }}
    >
      {children}
    </MySalaryClaimantContext.Provider>
  );
}

export function useMySalaryClaimantFromContext() {
  return useContext(MySalaryClaimantContext);
}
