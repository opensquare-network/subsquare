import { createContext, useContext } from "react";
import { useSubscribeHydrationTreasuryBalances } from "../hook/useSubscribeHydrationTreasuryBalances";

const HydrationTreasurySummaryContext = createContext();

export function TreasuryOnHydrationProvider({ children }) {
  const { dot, usdt, usdc, isLoading } =
    useSubscribeHydrationTreasuryBalances();

  return (
    <HydrationTreasurySummaryContext.Provider
      value={{
        dot,
        usdt,
        usdc,
        isLoading,
      }}
    >
      {children}
    </HydrationTreasurySummaryContext.Provider>
  );
}

export function useHydrationTreasurySummary() {
  return useContext(HydrationTreasurySummaryContext);
}
