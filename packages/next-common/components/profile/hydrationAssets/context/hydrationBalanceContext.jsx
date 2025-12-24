"use client";

import { createContext, useContext, useMemo } from "react";
import BigNumber from "bignumber.js";
import useHydrationTotalAssetsBalance from "next-common/hooks/ecoAssets/hydration";
import useProfileAddress from "next-common/components/profile/useProfileAddress";
import { HydrationSDKProvider } from "next-common/hooks/ecoAssets/hydration/context/hydrationSDKContext";

const HydrationBalanceContext = createContext(null);

function HydrationBalanceProviderImpl({ children }) {
  const address = useProfileAddress();
  const { balance, isLoading } = useHydrationTotalAssetsBalance(address);
  console.log(":::::::Hydration balance:", balance, isLoading);

  const hasBalance = useMemo(() => {
    if (isLoading || !balance) {
      return false;
    }

    return new BigNumber(balance).isGreaterThan(0);
  }, [balance, isLoading]);

  return (
    <HydrationBalanceContext.Provider
      value={{
        balance,
        isLoading,
        hasBalance,
      }}
    >
      {children}
    </HydrationBalanceContext.Provider>
  );
}

export function HydrationBalanceProvider({ children }) {
  return (
    <HydrationSDKProvider>
      <HydrationBalanceProviderImpl>{children}</HydrationBalanceProviderImpl>
    </HydrationSDKProvider>
  );
}

export function useHydrationBalanceContext() {
  const context = useContext(HydrationBalanceContext);
  return context;
}
