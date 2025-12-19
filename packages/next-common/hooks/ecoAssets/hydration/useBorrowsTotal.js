import { useState, useCallback, useEffect } from "react";
import BigNumber from "bignumber.js";
import { useHydrationSDK } from "next-common/hooks/ecoAssets/hydration/context/hydrationSDKContext";
import { USD_DECIMALS } from "./utils/constants";

export default function useBorrowsTotal(address) {
  const sdk = useHydrationSDK();
  const [totalBorrowsUSD, setTotalBorrowsUSD] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBorrowUserSummary = useCallback(
    async (isCancelled) => {
      if (!sdk?.api || !address || isCancelled()) {
        return;
      }

      try {
        const aave = await sdk.api.aave.getSummary(address);

        const totalBorrows = new BigNumber(aave?.totalDebt?.toString() ?? "0")
          .shiftedBy(-USD_DECIMALS)
          .toString();

        setTotalBorrowsUSD(totalBorrows);
      } catch (error) {
        console.error("Error fetching borrows total:", error);
        setTotalBorrowsUSD("0");
      } finally {
        setIsLoading(false);
      }
    },
    [address, sdk],
  );

  useEffect(() => {
    let cancelled = false;
    const isCancelled = () => cancelled;

    fetchBorrowUserSummary(isCancelled);

    return () => {
      cancelled = true;
    };
  }, [fetchBorrowUserSummary]);

  return { balance: totalBorrowsUSD, isLoading };
}
