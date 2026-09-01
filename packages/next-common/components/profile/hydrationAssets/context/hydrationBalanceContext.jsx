"use client";

import { createContext, useContext, useMemo } from "react";
import BigNumber from "bignumber.js";
import useHydrationTotalAssetsBalance from "next-common/hooks/ecoAssets/hydration";
import useHydrationAssetsBalance from "next-common/hooks/ecoAssets/hydration/useHydrationAssetsBalance";
import useProfileAddress from "next-common/components/profile/useProfileAddress";
import { HydrationSDKProvider } from "next-common/hooks/ecoAssets/hydration/context/hydrationSDKContext";

const HydrationBalanceContext = createContext(null);

function HydrationBalanceContextProvider({ children, balance, isLoading }) {
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

function HydrationTotalBalanceProviderImpl({ children }) {
  const address = useProfileAddress();
  const { balance, isLoading } = useHydrationTotalAssetsBalance(address);

  return (
    <HydrationBalanceContextProvider balance={balance} isLoading={isLoading}>
      {children}
    </HydrationBalanceContextProvider>
  );
}

function HydrationAssetsBalanceProviderImpl({ children }) {
  const address = useProfileAddress();
  const { balance, isLoading } = useHydrationAssetsBalance(address);

  return (
    <HydrationBalanceContextProvider balance={balance} isLoading={isLoading}>
      {children}
    </HydrationBalanceContextProvider>
  );
}

export function HydrationBalanceProvider({ children }) {
  return (
    <HydrationSDKProvider>
      <HydrationTotalBalanceProviderImpl>
        {children}
      </HydrationTotalBalanceProviderImpl>
    </HydrationSDKProvider>
  );
}

export function HydrationAssetsBalanceProvider({ children }) {
  return (
    <HydrationSDKProvider>
      <HydrationAssetsBalanceProviderImpl>
        {children}
      </HydrationAssetsBalanceProviderImpl>
    </HydrationSDKProvider>
  );
}

export function useHydrationBalanceContext() {
  const context = useContext(HydrationBalanceContext);
  return context;
}
