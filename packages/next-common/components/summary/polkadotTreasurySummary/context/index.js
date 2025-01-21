import { createContext, useContext } from "react";
import useQueryAssetHubAssets from "next-common/hooks/assetHub/useQueryAssetHubAssets";
import { useQueryAssetHubTreasuryFree } from "../hook/useQueryAssetHubTreasuryFree";
import {
  StatemintTreasuryAccount,
  getAssetBySymbol,
  StatemintFellowShipTreasuryAccount,
} from "next-common/hooks/treasury/useAssetHubTreasuryBalance";
import useTreasuryFree from "next-common/utils/hooks/useTreasuryFree";
import { useContextApi } from "next-common/context/api";
import useQueryFellowshipSalaryBalance from "../hook/useQueryFellowshipSalaryBalance";
import {
  useQueryBounties,
  useBountiesTotalBalance,
} from "../hook/useQueryBountiesData";
import useQueryAmbassadorBalance, {
  AmbassadorAccount,
} from "../hook/useQueryAmbassadorBalance";

const PolkadotTreasurySummaryContext = createContext();

function useTreasuryAccountAssetBalance(symbol) {
  const asset = getAssetBySymbol(symbol);
  return useQueryAssetHubAssets(asset.id, StatemintTreasuryAccount);
}

export function PolkadotTreasurySummaryProvider({ children }) {
  const api = useContextApi();
  const {
    free: dotTreasuryBalanceOnRelayChain,
    isLoading: isDotTreasuryBalanceOnRelayChainLoading,
  } = useTreasuryFree(api);

  const {
    free: fellowshipTreasuryDotBalance,
    isLoading: isFellowshipTreasuryDotBalanceLoading,
  } = useQueryAssetHubTreasuryFree(StatemintFellowShipTreasuryAccount);

  const {
    balance: fellowshipSalaryUsdtBalance,
    isLoading: isFellowshipSalaryUsdtBalanceLoading,
  } = useQueryFellowshipSalaryBalance("USDT");

  const {
    free: dotTreasuryBalanceOnAssetHub,
    isLoading: isDotTreasuryBalanceOnAssetHubLoading,
  } = useQueryAssetHubTreasuryFree(StatemintTreasuryAccount);

  const {
    balance: usdtTreasuryBalanceOnAssetHub,
    isLoading: isUsdtTreasuryBalanceOnAssetHubLoading,
  } = useTreasuryAccountAssetBalance("USDT");

  const {
    balance: usdcTreasuryBalanceOnAssetHub,
    isLoading: isUsdcTreasuryBalanceOnAssetHubLoading,
  } = useTreasuryAccountAssetBalance("USDC");

  const {
    bounties,
    bountiesCount,
    isLoading: isQueryBountiesLoading,
  } = useQueryBounties(api);
  const {
    balance: dotTreasuryBalanceOnBounties,
    isLoading: isBountiesTotalBalanceLoading,
  } = useBountiesTotalBalance(bounties, api);

  const {
    balance: ambassadorUsdtBalance,
    isLoading: isAmbassadorUsdtBalanceLoading,
  } = useQueryAmbassadorBalance(AmbassadorAccount);

  const isDotTreasuryBalanceOnBountiesLoading =
    isQueryBountiesLoading || isBountiesTotalBalanceLoading;

  return (
    <PolkadotTreasurySummaryContext.Provider
      value={{
        dotTreasuryBalanceOnRelayChain,
        isDotTreasuryBalanceOnRelayChainLoading,
        dotTreasuryBalanceOnAssetHub,
        isDotTreasuryBalanceOnAssetHubLoading,
        fellowshipTreasuryDotBalance,
        isFellowshipTreasuryDotBalanceLoading,
        fellowshipSalaryUsdtBalance,
        isFellowshipSalaryUsdtBalanceLoading,
        usdtTreasuryBalanceOnAssetHub,
        isUsdtTreasuryBalanceOnAssetHubLoading,
        usdcTreasuryBalanceOnAssetHub,
        isUsdcTreasuryBalanceOnAssetHubLoading,
        loanCentrifugeUsdcBalance: 1500000000000,
        loanBifrostDotBalance: 5000000000000000,
        loadPendulumDotBalance: 500000000000000,
        loanHydrationDotBalance: 10000000000000000,
        bountiesCount,
        dotTreasuryBalanceOnBounties,
        isDotTreasuryBalanceOnBountiesLoading,
        ambassadorUsdtBalance,
        isAmbassadorUsdtBalanceLoading,
      }}
    >
      {children}
    </PolkadotTreasurySummaryContext.Provider>
  );
}

export function usePolkadotTreasurySummary() {
  return useContext(PolkadotTreasurySummaryContext);
}
