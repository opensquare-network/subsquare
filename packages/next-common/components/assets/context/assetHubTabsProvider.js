import { createStateContext } from "react-use";
import { useCallback, useEffect } from "react";
import useMyAssets from "next-common/components/assets/useMyAssets";

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

const [useAssetsContext, AssetsProvider] = createStateContext();

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

export const useAssets = () => {
  const [state, setState] = useAssetsContext();
  const [, setTotalCount] = useTotalCounts();
  const assets = useMyAssets();

  useEffect(() => {
    if (assets) {
      setState(assets);
      setTotalCount("assets", assets.length); // 在这里更新 totalCounts
    }
  }, [setState, setTotalCount, assets]);

  return state;
};

export function AssetHubTabsProvider({ children }) {
  return (
    <ActiveTabProvider>
      <TotalCountsProvider>
        <AssetsProvider>{children}</AssetsProvider>
      </TotalCountsProvider>
    </ActiveTabProvider>
  );
}
