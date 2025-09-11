import { createContext, useContext } from "react";
import { useQueryHydrationTreasuryBalances } from "../hook/useQueryHydrationTreasuryBalances";

const HydrationTreasurySummaryContext = createContext();

export function TreasuryOnHydrationProvider({ children }) {
  const { dot, usdt, usdc, isLoading } = useQueryHydrationTreasuryBalances();

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
