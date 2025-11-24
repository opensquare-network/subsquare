import { createContext, useContext, useMemo } from "react";
import { useAsync } from "react-use";
import { useContextApi } from "../api";

export const StakersOverviewContext = createContext();

function normalizeStakerOverviewItem(item) {
  const account = item[0].args[1].toString();
  const info = item[1].toJSON();
  return { ...info, account };
}

export function StakersOverviewProvider({ children, eraIndex }) {
  const api = useContextApi();
  const { value: overview, loading } = useAsync(async () => {
    if (!api) {
      return null;
    }
    const overview = await api.query.staking.erasStakersOverview.entries(
      eraIndex,
    );
    return overview.map(normalizeStakerOverviewItem);
  }, [api, eraIndex]);

  return (
    <StakersOverviewContext.Provider value={{ overview, loading }}>
      {children}
    </StakersOverviewContext.Provider>
  );
}

export function useActiveValidators() {
  const { overview, loading } = useContext(StakersOverviewContext);
  return useMemo(() => {
    if (loading) {
      return { validators: null, loading: true };
    }
    const validators = (overview || []).map((item) => item.account);
    return { validators, loading: false };
  }, [overview, loading]);
}
