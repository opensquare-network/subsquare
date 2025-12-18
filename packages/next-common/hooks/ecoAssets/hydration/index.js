import useAssetsTotal from "./useAssetsTotal";
import useFarmsTotal from "./useFarmsTotal";
import useLPTotal from "./useLPTotal";
import useXykTotal from "./useXykTotal";
import useBorrowsTotal from "./useBorrowsTotal";
import BigNumber from "bignumber.js";
import { useMemo } from "react";

export default function useHydrationTotalAssetsBalance(address) {
  const { balance: assetsTotal, isLoading: assetsIsLoading } =
    useAssetsTotal(address);
  const { balance: lpTotal, isLoading: lpIsLoading } = useLPTotal(address);
  const { balance: farmsTotal, isLoading: farmsIsLoading } =
    useFarmsTotal(address);
  const { balance: xykTotal, isLoading: xykIsLoading } = useXykTotal(address);
  const { balance: borrowsTotal, isLoading: borrowsIsLoading } =
    useBorrowsTotal(address);

  const isLoading =
    assetsIsLoading ||
    lpIsLoading ||
    farmsIsLoading ||
    xykIsLoading ||
    borrowsIsLoading;

  const balanceTotal = useMemo(() => {
    if (isLoading) {
      return "0";
    }

    const values = [assetsTotal, farmsTotal, lpTotal, xykTotal, borrowsTotal];
    if (values.some((v) => v === null || v === undefined)) {
      return "0";
    }

    return BigNumber(assetsTotal || 0)
      .plus(farmsTotal || 0)
      .plus(lpTotal || 0)
      .plus(xykTotal || 0)
      .minus(borrowsTotal || 0)
      .toString();
  }, [isLoading, assetsTotal, farmsTotal, lpTotal, xykTotal, borrowsTotal]);

  return {
    balance: balanceTotal,
    isLoading,
  };
}
