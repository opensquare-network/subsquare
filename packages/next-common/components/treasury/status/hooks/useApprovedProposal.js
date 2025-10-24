import nextApi from "next-common/services/nextApi";
import { useAsync } from "react-use";
import { EmptyList } from "next-common/utils/constants";
import { useMemo } from "react";
import BigNumber from "bignumber.js";

export default function useApprovedProposal() {
  const { value: result, loading } = useAsync(async () => {
    const { result } = await nextApi.fetch(
      "treasury/proposals/dotreasury-list",
      {
        page: 1,
        page_size: 100,
        status: "Approved",
      },
    );
    return result ?? EmptyList;
  });

  return {
    result,
    loading,
  };
}

export function useApprovedProposalStatistics() {
  const { result, loading } = useApprovedProposal();

  return useMemo(() => {
    return {
      totalAmount: result?.items?.reduce(
        (acc, item) => acc.plus(item?.fiatValue ?? 0),
        BigNumber(0),
      ),
      total: result?.total || 0,
      loading,
    };
  }, [result, loading]);
}
