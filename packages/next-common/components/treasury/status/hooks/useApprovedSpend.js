import nextApi from "next-common/services/nextApi";
import { useAsync } from "react-use";
import { EmptyList } from "next-common/utils/constants";
import { useMemo } from "react";
import { useChainSettings } from "next-common/context/chain";
import { useFiatPriceSnapshot } from "next-common/hooks/useFiatPrice";
import BigNumber from "bignumber.js";
import { toPrecision } from "next-common/utils";
import { SYMBOL_DECIMALS } from "next-common/utils/consts/asset";

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
  const { result, loading: loadingSpend } = useApprovedSpend();
  const { decimals } = useChainSettings();
  const { price: fiatPrice, loading: fiatPriceLoading } =
    useFiatPriceSnapshot();

  const totalAmount = useMemo(() => {
    return result?.items?.reduce((acc, item) => {
      const { assetKind, amount } = item?.extracted ?? {};

      if (assetKind?.type === "native") {
        const amountInFiat = BigNumber(
          toPrecision(amount, decimals),
        ).multipliedBy(fiatPrice ?? 0);

        return acc.plus(amountInFiat ?? 0);
      } else if (SYMBOL_DECIMALS[assetKind?.symbol]) {
        return acc.plus(
          toPrecision(amount, SYMBOL_DECIMALS[assetKind?.symbol]),
        );
      }
      return acc;
    }, BigNumber(0));
  }, [result?.items, decimals, fiatPrice]);

  return {
    totalAmount,
    total: result?.total || 0,
    loading: loadingSpend || fiatPriceLoading,
  };
}
