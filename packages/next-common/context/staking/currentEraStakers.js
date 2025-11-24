import { useContext } from "react";
import { useCurrentEra } from "./activeEra";
import { CurrentEraStakersOverviewProvider } from "./currentEraStakersOverview";
import { EraStakersContext, EraStakersProvider } from "./eraStakers";
import { useActiveValidators } from "./stakersOverview";

function CurrentEraStakersProviderImpl({ children }) {
  const { currentEra, loading: isCurrentEraLoading } = useCurrentEra();
  const { validators, loading: isValidatorsLoading } = useActiveValidators();
  if (isCurrentEraLoading || isValidatorsLoading) {
    return (
      <EraStakersContext.Provider value={{ eraStakers: null, loading: true }}>
        {children}
      </EraStakersContext.Provider>
    );
  }
  return (
    <EraStakersProvider eraIndex={currentEra} validators={validators}>
      {children}
    </EraStakersProvider>
  );
}

export function CurrentEraStakersProvider({ children }) {
  return (
    <CurrentEraStakersOverviewProvider>
      <CurrentEraStakersProviderImpl>{children}</CurrentEraStakersProviderImpl>
    </CurrentEraStakersOverviewProvider>
  );
}

export function useCurrentEraStakers() {
  const { eraStakers, loading } = useContext(EraStakersContext);
  return { eraStakers, loading };
}
