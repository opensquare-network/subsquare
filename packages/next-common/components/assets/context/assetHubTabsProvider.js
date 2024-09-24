import { createStateContext } from "react-use";
import { useCallback } from "react";

export const TABS = Object.freeze({
  assets: 1,
  transfers: 2,
});

const [useActiveTabContext, ActiveTabProvider] = createStateContext({
  activeTabId: TABS.assets,
});

const [useTotalCountsContext, TotalCountsProvider] = createStateContext({
  totalCounts: {
    assets: 0,
    transfers: 0,
  },
});

export const useActiveTab = () => {
  const [state, setState] = useActiveTabContext();

  const setActiveTabId = useCallback(
    (newTabId) => {
      setState({ activeTabId: newTabId });
    },
    [setState],
  );

  return [state.activeTabId, setActiveTabId];
};

export const useTotalCounts = () => {
  const [state, setState] = useTotalCountsContext();

  const setTotalCount = useCallback(
    (tabKey, count) => {
      setState((prevState) => ({
        totalCounts: {
          ...prevState.totalCounts,
          [tabKey]: count,
        },
      }));
    },
    [setState],
  );

  return [state.totalCounts, setTotalCount];
};

export function AssetHubTabsProvider({ children }) {
  return (
    <ActiveTabProvider>
      <TotalCountsProvider>{children}</TotalCountsProvider>
    </ActiveTabProvider>
  );
}
