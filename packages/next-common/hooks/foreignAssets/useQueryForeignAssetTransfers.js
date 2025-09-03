import { useEffect } from "react";
import useForeignAssetTransfers from "./useForeignAssetTransfers";
import { defaultPageSize } from "next-common/utils/constants";
import {
  useTransfersHistoryContext,
  useTotalCounts,
} from "next-common/components/assets/context/assetHubTabsProvider";

const useQueryForeignAssetTransfers = (address, page) => {
  const [state, setState] = useTransfersHistoryContext();
  const [, setTotalCount] = useTotalCounts();
  const { value, total, loading } = useForeignAssetTransfers(
    address,
    page,
    defaultPageSize,
  );

  useEffect(() => {
    if (loading) {
      return;
    }

    setState({ list: value, total });
    setTotalCount("transfers", total);
  }, [loading, value, total, setState, setTotalCount]);

  return {
    list: state.list,
    total: state.total,
    loading,
  };
};

export default useQueryForeignAssetTransfers;
