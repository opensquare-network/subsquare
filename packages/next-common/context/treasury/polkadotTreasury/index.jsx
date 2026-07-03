import {
  StatemintFellowShipTreasuryAccount,
  StatemintTreasuryAccount,
} from "next-common/hooks/treasury/useAssetHubTreasuryBalance";
import { createContext, useContext } from "react";
import { useQueryAssetHubTreasuryFreeWithPapi } from "./hooks/useQueryAssetHubTreasuryFreeWithPapi";
import {
  useBountiesTotalBalance,
  useQueryBounties,
} from "./hooks/useQueryBountiesData";
import {
  useQueryMultiAssetsBounties,
  useMultiAssetsBountiesTotalBalance,
} from "./hooks/useQueryMultiAssetBountiesData";
import useQueryFellowshipSalaryBalance from "./hooks/useQueryFellowshipSalaryBalance";
import usePolkadotTreasuryTotal from "next-common/utils/hooks/usePolkadotTreasuryTotal";
import { PapiProvider, useContextPapi } from "next-common/context/papi";
import { useChainSettings } from "next-common/context/chain";

const PolkadotTreasuryContext = createContext();

export default function PolkadotTreasuryProvider({ children }) {
  return (
    <PapiProvider>
      <PolkadotTreasuryProviderInner>{children}</PolkadotTreasuryProviderInner>
    </PapiProvider>
  );
}

function PolkadotTreasuryProviderInner({ children }) {
  const { api: papi, checkPallet } = useContextPapi();
  const { decimals: chainDecimals, symbol: chainSymbol } = useChainSettings();
  const {
    treasuryAccount,
    relayChainTreasuryBalance: nativeTreasuryBalanceOnRelayChain,
    isRelayChainTreasuryBalanceLoading,
    isNativeLoading: isDotTreasuryTotalBalanceLoading,
    totalNativeFree: dotTreasuryTotalBalance,
    totalUsdtBalance: dotTreasuryTotalUsdtBalance,
    isUsdtLoading: isDotTreasuryTotalUsdtLoading,
    totalUsdcBalance: dotTreasuryTotalUsdcBalance,
    isUsdcLoading: isDotTreasuryTotalUsdcLoading,
  } = usePolkadotTreasuryTotal(papi);

  const {
    free: fellowshipTreasuryDotBalance,
    isLoading: isFellowshipTreasuryDotBalanceLoading,
  } = useQueryAssetHubTreasuryFreeWithPapi(StatemintFellowShipTreasuryAccount);

  const {
    balance: fellowshipSalaryUsdtBalance,
    isLoading: isFellowshipSalaryUsdtBalanceLoading,
  } = useQueryFellowshipSalaryBalance("USDT");

  const {
    free: dotTreasuryBalanceOnAssetHub,
    isLoading: isDotTreasuryBalanceOnAssetHubLoading,
  } = useQueryAssetHubTreasuryFreeWithPapi(StatemintTreasuryAccount);

  const {
    bounties,
    bountiesCount,
    isLoading: isQueryBountiesLoading,
  } = useQueryBounties(papi);

  const {
    balance: dotTreasuryBalanceOnBounties,
    isLoading: isBountiesTotalBalanceLoading,
  } = useBountiesTotalBalance(bounties, papi);

  const isDotTreasuryBalanceOnBountiesLoading =
    isQueryBountiesLoading || isBountiesTotalBalanceLoading;

  const {
    bounties: multiAssetBounties,
    bountiesCount: multiAssetBountiesCount,
    isLoading: isMultiAssetBountiesLoading,
  } = useQueryMultiAssetsBounties(papi, checkPallet);

  const {
    totalByAsset: multiAssetBountiesTotalByAsset,
    isLoading: isMultiAssetsBountiesTotalBalanceLoading,
  } = useMultiAssetsBountiesTotalBalance(
    multiAssetBounties,
    papi,
    chainDecimals,
    chainSymbol,
  );

  const isMultiAssetBountiesTotalByAssetLoading =
    isMultiAssetBountiesLoading || isMultiAssetsBountiesTotalBalanceLoading;

  return (
    <PolkadotTreasuryContext.Provider
      value={{
        // treasury account address
        treasuryAccount,
        nativeTreasuryBalanceOnRelayChain,
        isRelayChainTreasuryBalanceLoading,

        // total balances
        dotTreasuryTotalBalance,
        isDotTreasuryTotalBalanceLoading,
        dotTreasuryTotalUsdtBalance,
        isDotTreasuryTotalUsdtLoading,
        dotTreasuryTotalUsdcBalance,
        isDotTreasuryTotalUsdcLoading,

        dotTreasuryBalanceOnAssetHub,
        isDotTreasuryBalanceOnAssetHubLoading,

        // fellowship treasury
        fellowshipTreasuryDotBalance,
        isFellowshipTreasuryDotBalanceLoading,
        fellowshipSalaryUsdtBalance,
        isFellowshipSalaryUsdtBalanceLoading,

        // loans
        loanBifrostDotBalance: 10000000000000000,
        loadPendulumDotBalance: 500000000000000,
        loanHydrationDotBalance: 10000000000000000,

        // bounties
        bountiesCount,
        dotTreasuryBalanceOnBounties,
        isDotTreasuryBalanceOnBountiesLoading,

        // multi-asset bounties
        multiAssetBountiesCount,
        multiAssetBountiesTotalByAsset,
        isMultiAssetBountiesTotalByAssetLoading,
      }}
    >
      {children}
    </PolkadotTreasuryContext.Provider>
  );
}

export function usePolkadotTreasury() {
  return useContext(PolkadotTreasuryContext);
}
