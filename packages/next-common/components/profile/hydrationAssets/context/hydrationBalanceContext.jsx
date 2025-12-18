import { createContext, useContext, useMemo } from "react";
import BigNumber from "bignumber.js";
import useHydrationTotalAssetsBalance from "next-common/hooks/ecoAssets/hydration";
import useProfileAddress from "next-common/components/profile/useProfileAddress";
import { HydrationSDKProvider } from "next-common/hooks/ecoAssets/hydration/context/hydrationSDKContext";
import { useChainSettings } from "next-common/context/chain";
import { usePathname } from "next/navigation";

const HydrationBalanceContext = createContext(null);

function useHasHydrationAssets() {
  const chainSettings = useChainSettings();
  const pathname = usePathname();
  const isProfilePage = pathname.startsWith("/user");

  return useMemo(() => {
    return chainSettings?.ecoAssets?.hydration && isProfilePage;
  }, [chainSettings, isProfilePage]);
}

function HydrationBalanceProviderImpl({ children }) {
  const address = useProfileAddress();
  const { balance, isLoading } = useHydrationTotalAssetsBalance(address);
  const hasHydrationAssets = useHasHydrationAssets();

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
        showHydrationAssets: hasHydrationAssets && hasBalance,
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

export function useHydrationBalance() {
  const context = useContext(HydrationBalanceContext);
  return context;
}
