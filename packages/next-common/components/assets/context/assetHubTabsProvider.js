import { createStateContext } from "react-use";
import { useCallback, useEffect } from "react";
import useMyAssets from "next-common/components/assets/useMyAssets";
import useTransfersHistory from "next-common/utils/hooks/useTransfersHistory";
import { defaultPageSize } from "next-common/utils/constants";

export const TABS = Object.freeze({
  assets: 1,
  transfers: 2,
});

const [useActiveTabContext, ActiveTabProvider] = createStateContext({
  activeTabId: TABS.assets,
});

const [useTotalCountsContext, TotalCountsProvider] = createStateContext({
  assets: "",
  transfers: "",
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
        ...prevState,
        [tabKey]: count,
      }));
    },
    [setState],
  );

  return [state, setTotalCount];
};

export const useAssets = () => {
  const [state, setState] = useAssetsContext();
  const [, setTotalCount] = useTotalCounts();
  const assets = useMyAssets();

  useEffect(() => {
    if (assets) {
      setState(assets);
      setTotalCount("assets", assets.length);
    }
  }, [setState, setTotalCount, assets]);

  return state;
};

const [useTransfersHistoryContext, TransfersHistoryProvider] =
  createStateContext({
    list: [],
    total: 0,
  });

export const useTransfersHistoryData = (page) => {
  const [state, setState] = useTransfersHistoryContext();
  const [, setTotalCount] = useTotalCounts();
  const { value, total, loading, error } = useTransfersHistory(page, defaultPageSize);

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
