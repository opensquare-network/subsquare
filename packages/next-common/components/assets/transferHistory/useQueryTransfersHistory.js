import { useEffect } from "react";
import useTransfersHistory from "next-common/utils/hooks/useTransfersHistory";
import { defaultPageSize } from "next-common/utils/constants";
import {
  useTransfersHistoryContext,
  useTotalCounts,
} from "next-common/components/assets/context/assetHubTabsProvider";

const useQueryTransfersHistory = (address, page) => {
  const [state, setState] = useTransfersHistoryContext();
  const [, setTotalCount] = useTotalCounts();
  const { value, total, loading, error } = useTransfersHistory(
    address,
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

export default useQueryTransfersHistory;
