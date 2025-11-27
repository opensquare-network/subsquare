import { ActiveEraProvider, useCurrentEra } from "./activeEra";
import {
  StakersOverviewContext,
  StakersOverviewProvider,
} from "./stakersOverview";

function CurrentEraStakersOverviewProviderImpl({ children }) {
  const { currentEra, loading } = useCurrentEra();
  if (loading) {
    return (
      <StakersOverviewContext.Provider
        value={{ overview: null, loading: true }}
      >
        {children}
      </StakersOverviewContext.Provider>
    );
  }
  return (
    <StakersOverviewProvider eraIndex={currentEra}>
      {children}
    </StakersOverviewProvider>
  );
}

export function CurrentEraStakersOverviewProvider({ children }) {
  return (
    <ActiveEraProvider>
      <CurrentEraStakersOverviewProviderImpl>
        {children}
      </CurrentEraStakersOverviewProviderImpl>
    </ActiveEraProvider>
  );
}
