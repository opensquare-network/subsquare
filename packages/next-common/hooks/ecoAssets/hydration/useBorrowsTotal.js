import { createSdkContext } from "@galacticcouncil/sdk";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { useState, useCallback, useEffect } from "react";
import { USD_DECIMALS } from "@aave/math-utils";
import BigNumber from "bignumber.js";

//  Hydration SDK in provider?
const ws = "wss://rpc.hydradx.cloud";
const wsProvider = new WsProvider(ws, 2_500, {}, 60_000, 102400, 10 * 60_000);

const api = await ApiPromise.create({
  provider: wsProvider,
});

const sdk = await createSdkContext(api);

export default function useBorrowsTotal(address) {
  const { api } = sdk ?? {};
  const [totalBorrowsUSD, setTotalBorrowsUSD] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBorrowUserSummary = useCallback(async () => {
    if (!api) {
      return null;
    }

    try {
      setIsLoading(true);
      const aave = await api.aave.getSummary(address);
      const totalBorrows = new BigNumber(aave?.totalDebt?.toString() ?? "0")
        .shiftedBy(-USD_DECIMALS)
        .toString();

      setTotalBorrowsUSD(totalBorrows);
    } catch (error) {
      console.error("Error fetching XYK pools:", error);
    } finally {
      setIsLoading(false);
    }
  }, [address, api]);

  useEffect(() => {
    fetchBorrowUserSummary();
  }, [fetchBorrowUserSummary]);

  return { balance: totalBorrowsUSD, isLoading };
}
