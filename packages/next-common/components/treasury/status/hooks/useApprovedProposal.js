import nextApi from "next-common/services/nextApi";
import { useAsync } from "react-use";
import { EmptyList } from "next-common/utils/constants";
import { useMemo } from "react";
import BigNumber from "bignumber.js";
import { useFiatPriceSnapshot } from "next-common/hooks/useFiatPrice";
import { toPrecision } from "next-common/utils";
import { useChainSettings } from "next-common/context/chain";

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
  const { decimals } = useChainSettings();
  const { result, loading } = useApprovedProposal();
  const { price: fiatPrice, loading: fiatPriceLoading } =
    useFiatPriceSnapshot();

  return useMemo(() => {
    return {
      totalAmount: result?.items?.reduce((acc, item) => {
        const value = toPrecision(item?.onchainData?.value, decimals);
        const amountInFiat = BigNumber(value).multipliedBy(fiatPrice ?? 0);
        return acc.plus(amountInFiat ?? 0);
      }, BigNumber(0)),
      total: result?.total || 0,
      loading: loading || fiatPriceLoading,
    };
  }, [result, loading, decimals, fiatPrice, fiatPriceLoading]);
}
