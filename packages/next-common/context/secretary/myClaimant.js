import { createContext, useContext } from "react";
import useMySalaryClaimant from "next-common/hooks/fellowship/salary/useMySalaryClaimant";
import LoginGuard from "next-common/components/loginGuard";

const SecretaryMySalaryClaimantContext = createContext(null);

function SecretaryMySalaryClaimantProviderWithoutGuard({ children }) {
  const { claimant, isLoading } = useMySalaryClaimant();

  return (
    <SecretaryMySalaryClaimantContext.Provider value={{ claimant, isLoading }}>
      {children}
    </SecretaryMySalaryClaimantContext.Provider>
  );
}

function SecretaryMySalaryClaimantProviderFallback({ children }) {
  return (
    <SecretaryMySalaryClaimantContext.Provider
      value={{ claimant: null, isLoading: false }}
    >
      {children}
    </SecretaryMySalaryClaimantContext.Provider>
  );
}

export function SecretaryMySalaryClaimantProvider({ children }) {
  return (
    <LoginGuard
      fallback={
        <SecretaryMySalaryClaimantProviderFallback>
          {children}
        </SecretaryMySalaryClaimantProviderFallback>
      }
    >
      <SecretaryMySalaryClaimantProviderWithoutGuard>
        {children}
      </SecretaryMySalaryClaimantProviderWithoutGuard>
    </LoginGuard>
  );
}

export function useSecretaryMySalaryClaimantFromContext() {
  return useContext(SecretaryMySalaryClaimantContext);
}
