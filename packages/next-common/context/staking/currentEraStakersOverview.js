import { ActiveEraProvider, useActiveEra } from "./activeEra";
import {
  StakersOverviewContext,
  StakersOverviewProvider,
} from "./stakersOverview";

function ActiveEraStakersOverviewProviderImpl({ children }) {
  const { activeEraIndex, loading } = useActiveEra();
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
    <StakersOverviewProvider eraIndex={activeEraIndex}>
      {children}
    </StakersOverviewProvider>
  );
}

export function ActiveEraStakersOverviewProvider({ children }) {
  return (
    <ActiveEraProvider>
      <ActiveEraStakersOverviewProviderImpl>
        {children}
      </ActiveEraStakersOverviewProviderImpl>
    </ActiveEraProvider>
  );
}
