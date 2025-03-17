import { createContext, useContext } from "react";
import useMySalaryClaimant from "next-common/hooks/fellowship/salary/useMySalaryClaimant";
import useSubMyCoreMember from "next-common/hooks/fellowship/core/useSubMyCoreMember";
import LoginGuard from "next-common/components/loginGuard";

const MySalaryClaimantContext = createContext(null);

function MySalaryClaimantProviderWithoutGuard({ children }) {
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

function MySalaryClaimantProviderFallback({ children }) {
  return (
    <MySalaryClaimantContext.Provider
      value={{
        claimant: null,
        member: null,
        isLoading: false,
      }}
    >
      {children}
    </MySalaryClaimantContext.Provider>
  );
}

export function MySalaryClaimantProvider({ children }) {
  return (
    <LoginGuard
      fallback={
        <MySalaryClaimantProviderFallback>
          {children}
        </MySalaryClaimantProviderFallback>
      }
    >
      <MySalaryClaimantProviderWithoutGuard>
        {children}
      </MySalaryClaimantProviderWithoutGuard>
    </LoginGuard>
  );
}

export function useMySalaryClaimantFromContext() {
  return useContext(MySalaryClaimantContext);
}
