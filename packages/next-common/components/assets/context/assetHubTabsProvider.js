import { createStateContext } from "react-use";
import { useCallback, useEffect } from "react";
import useMyAssets from "next-common/components/assets/useMyAssets";
import useTransfersHistory from "next-common/utils/hooks/useTransfersHistory";
import { defaultPageSize } from "next-common/utils/constants";

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

export const useAssets = () => {
  const [assets, setAssets] = useAssetsContext();
  const [, setTotalCount] = useTotalCounts();
  const fetchedAssets = useMyAssets();

  useEffect(() => {
    if (fetchedAssets) {
      setAssets(fetchedAssets);
      setTotalCount("assets", fetchedAssets?.length || 0);
    }
  }, [fetchedAssets, setAssets, setTotalCount]);

  return assets;
};

export const useQueryTransfersHistory = (page) => {
  const [state, setState] = useTransfersHistoryContext();
  const [, setTotalCount] = useTotalCounts();
  const { value, total, loading, error } = useTransfersHistory(
    page,
    defaultPageSize,
  );

  useEffect(() => {
    if (!loading && !error && value) {
      setState({ list: value, total });
      setTotalCount("transfers", total);
    }
  }, [loading, error, value, total, setState, setTotalCount]);

  return {
    list: state.list,
    total: state.total,
    loading,
  };
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
