import { useContextApi } from "next-common/context/api";
import { KusamaAssetHubAccount } from "next-common/hooks/treasury/useAssetHubTreasuryBalance";
import useTreasuryFree from "next-common/utils/hooks/useTreasuryFree";
import { createContext, useContext } from "react";
import { useQueryAssetHubTreasuryFree } from "next-common/context/treasury/polkadotTreasury/hooks/useQueryAssetHubTreasuryFree";

const KusamaTreasuryContext = createContext();

export default function KusamaTreasuryProvider({ children }) {
  const api = useContextApi();
  const {
    free: nativeTreasuryBalanceOnRelayChain,
    isLoading: isNativeTreasuryBalanceOnRelayChainLoading,
  } = useTreasuryFree(api);

  const {
    free: nativeTreasuryBalanceOnAssetHub,
    isLoading: isNativeTreasuryBalanceOnAssetHubLoading,
  } = useQueryAssetHubTreasuryFree(KusamaAssetHubAccount);

  return (
    <KusamaTreasuryContext.Provider
      value={{
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
