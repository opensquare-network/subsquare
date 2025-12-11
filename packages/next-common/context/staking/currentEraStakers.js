import { useContext } from "react";
import { useActiveEra } from "./activeEra";
import { ActiveEraStakersOverviewProvider } from "./currentEraStakersOverview";
import { EraStakersContext, EraStakersProvider } from "./eraStakers";
import { useActiveValidators } from "./stakersOverview";

function ActiveEraStakersProviderImpl({ children }) {
  const { activeEraIndex, loading: isActiveEraLoading } = useActiveEra();
  const { validators, loading: isValidatorsLoading } = useActiveValidators();
  if (isActiveEraLoading || isValidatorsLoading) {
    return (
      <EraStakersContext.Provider value={{ eraStakers: null, loading: true }}>
        {children}
      </EraStakersContext.Provider>
    );
  }
  return (
    <EraStakersProvider eraIndex={activeEraIndex} validators={validators}>
      {children}
    </EraStakersProvider>
  );
}

export function ActiveEraStakersProvider({ children }) {
  return (
    <ActiveEraStakersOverviewProvider>
      <ActiveEraStakersProviderImpl>{children}</ActiveEraStakersProviderImpl>
    </ActiveEraStakersOverviewProvider>
  );
}

export function useActiveEraStakers() {
  const { eraStakers, loading } = useContext(EraStakersContext);
  return { eraStakers, loading };
}
