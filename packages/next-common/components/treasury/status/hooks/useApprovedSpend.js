import nextApi from "next-common/services/nextApi";
import { useAsync } from "react-use";
import { EmptyList } from "next-common/utils/constants";
import { useMemo } from "react";
import useSumExtractedAssetKinds from "../utils/useSumExtractedAssetKinds";

export default function useApprovedSpend() {
  const { value: result, loading } = useAsync(async () => {
    const { result } = await nextApi.fetch("treasury/spends", {
      page: 1,
      page_size: 100,
      status: "Approved",
    });
    return result ?? EmptyList;
  });

  return {
    result,
    loading,
  };
}

export function useApprovedSpendStatistics() {
  const { result, loading } = useApprovedSpend();
  const totalAmount = useSumExtractedAssetKinds(
    result?.items?.map((item) => item.extracted) ?? [],
  );

  return useMemo(() => {
    return {
      totalAmount,
      total: result?.total || 0,
      loading: loading,
    };
  }, [result, loading, totalAmount]);
}
