import useAssetsTotal from "./useAssetsTotal";
import useFarmsTotal from "./useFarmsTotal";
import useLPTotal from "./useLPTotal";
import useXykTotal from "./useXykTotal";
import useBorrowsTotal from "./useBorrowsTotal";
import BigNumber from "bignumber.js";
import { useMemo } from "react";

export default async function useTotalAssetsBalance() {
  const address = "12sNU8BXivMj1xQmcd4T39ugCyHjmhir8jkPqfAw5ZDESrx4";
  const { balance: assetsTotal, isLoading: assetsIsLoading } =
    useAssetsTotal(address);
  const { balance: lpTotal, isLoading: lpIsLoading } = useLPTotal(address);
  const { balance: farmsTotal, isLoading: farmsIsLoading } =
    useFarmsTotal(address);
  const { balance: xykTotal, isLoading: xykIsLoading } = useXykTotal(address);
  const { balance: borrowsTotal, isLoading: borrowsIsLoading } =
    useBorrowsTotal(address);

  console.log("::::assetsTotal", assetsTotal, assetsIsLoading);
  console.log("::::lpTotal", lpTotal, lpIsLoading);
  console.log("::::xykTotal", xykTotal, xykIsLoading);
  console.log("::::borrowsTotal", borrowsTotal, borrowsIsLoading);
  console.log("::::farmsTotal", farmsTotal, farmsIsLoading);

  const balanceTotal = useMemo(
    () =>
      BigNumber(assetsTotal)
        .plus(farmsTotal)
        .plus(lpTotal)
        .plus(xykTotal)
        .minus(borrowsTotal)
        .toString(),
    [assetsTotal, farmsTotal, lpTotal, xykTotal, borrowsTotal],
  );

  console.log("::::balanceTotal", balanceTotal);
  // return { balance, isLoading };
}
