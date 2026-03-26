import { KusamaAssetHubAccount } from "next-common/hooks/treasury/useAssetHubTreasuryBalance";
import { createContext, useContext } from "react";
import { useQueryAssetHubTreasuryFree } from "next-common/context/treasury/polkadotTreasury/hooks/useQueryAssetHubTreasuryFree";
import useTreasuryFreeWithPapi from "next-common/utils/hooks/useTreasuryFreeWithPapi";
import { PapiProvider, useContextPapiApi } from "next-common/context/papi";

const KusamaTreasuryContext = createContext();

export default function KusamaTreasuryProvider({ children }) {
  return (
    <PapiProvider>
      <KusamaTreasuryProviderInner>{children}</KusamaTreasuryProviderInner>
    </PapiProvider>
  );
}

function KusamaTreasuryProviderInner({ children }) {
  const papi = useContextPapiApi();
  const {
    treasuryAccount,
    free: nativeTreasuryBalanceOnRelayChain,
    isLoading: isNativeTreasuryBalanceOnRelayChainLoading,
  } = useTreasuryFreeWithPapi(papi);

  const {
    free: nativeTreasuryBalanceOnAssetHub,
    isLoading: isNativeTreasuryBalanceOnAssetHubLoading,
  } = useQueryAssetHubTreasuryFree(KusamaAssetHubAccount);

  return (
    <KusamaTreasuryContext.Provider
      value={{
        treasuryAccount,
        nativeTreasuryBalanceOnRelayChain,
        isNativeTreasuryBalanceOnRelayChainLoading,
        nativeTreasuryBalanceOnAssetHub,
        isNativeTreasuryBalanceOnAssetHubLoading,
        loansHydrationNativeBalance: 33333000000000000,
      }}
    >
      {children}
    </KusamaTreasuryContext.Provider>
  );
}

export function useKusamaTreasuryContext() {
  return useContext(KusamaTreasuryContext);
}
