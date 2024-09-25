import { createStateContext } from "react-use";
import { useCallback, useEffect } from "react";
import useAccountAssets from "next-common/components/assets/useAccountAssets";

export const TABS = Object.freeze({
  assets: 1,
  transfers: 2,
});

const [useActiveTabContext, ActiveTabProvider] = createStateContext(
  TABS.assets,
);

const [useTotalCountsContext, TotalCountsProvider] = createStateContext({
  assets: 0,
  transfers: 0,
});

const [useAssetsContext, AssetsProvider] = createStateContext();

const [useTransfersHistoryContext, TransfersHistoryProvider] =
  createStateContext({
    list: [],
    total: 0,
  });

export { useTransfersHistoryContext, useAssetsContext };

export const useActiveTab = () => {
  const [activeTabId, setActiveTabId] = useActiveTabContext();
  return [activeTabId, setActiveTabId];
};

export const useTotalCounts = () => {
  const [totalCounts, setTotalCounts] = useTotalCountsContext();

  const setTotalCount = useCallback(
    (tabKey, count) => {
      setTotalCounts((prev) => ({
        ...prev,
        [tabKey]: count,
      }));
    },
    [setTotalCounts],
  );

  return [totalCounts, setTotalCount];
};

export function AssetHubTabsProvider({ children }) {
  return (
    <ActiveTabProvider>
      <TotalCountsProvider>
        <AssetsProvider>
          <TransfersHistoryProvider>{children}</TransfersHistoryProvider>
        </AssetsProvider>
      </TotalCountsProvider>
    </ActiveTabProvider>
  );
}
