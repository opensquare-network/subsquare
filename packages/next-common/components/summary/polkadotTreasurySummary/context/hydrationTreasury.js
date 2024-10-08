import { createContext, useContext } from "react";
import { useSubscribeHydrationTreasuryFree } from "../hook/useSubscribeHydrationTreasuryFree";
import { HydrationTreasuryAccount } from "next-common/hooks/treasury/useHydrationTreasuryBalance";
import { useSubscribeHydrationTreasuryTokens } from "../hook/useSubscribeHydrationTreasuryTokens";

const HydrationTreasurySummaryContext = createContext();

export function HydrationTreasurySummaryProvider({ children }) {
  const { free: dot, isLoading: isDotLoading } =
    useSubscribeHydrationTreasuryFree(HydrationTreasuryAccount);

  const {
    usdt,
    usdc,
    isLoading: isTokensLoading,
  } = useSubscribeHydrationTreasuryTokens();

  return (
    <HydrationTreasurySummaryContext.Provider
      value={{
        dot,
        usdt,
        usdc,
        isDotLoading,
        isTokensLoading,
        isLoading: isDotLoading || isTokensLoading,
      }}
    >
      {children}
    </HydrationTreasurySummaryContext.Provider>
  );
}

export function useHydrationTreasurySummary() {
  return useContext(HydrationTreasurySummaryContext);
}
