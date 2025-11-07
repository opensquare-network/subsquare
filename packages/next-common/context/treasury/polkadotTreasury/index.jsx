import { useContextApi } from "next-common/context/api";
import {
  StatemintFellowShipTreasuryAccount,
  StatemintTreasuryAccount,
} from "next-common/hooks/treasury/useAssetHubTreasuryBalance";
import { createContext, useContext } from "react";
import useQueryAmbassadorBalance, {
  AmbassadorAccount,
} from "./hooks/useQueryAmbassadorBalance";
import { useQueryAssetHubTreasuryFree } from "./hooks/useQueryAssetHubTreasuryFree";
import {
  useBountiesTotalBalance,
  useQueryBounties,
} from "./hooks/useQueryBountiesData";
import useQueryFellowshipSalaryBalance from "./hooks/useQueryFellowshipSalaryBalance";
import usePolkadotTreasuryTotal from "next-common/utils/hooks/usePolkadotTreasuryTotal";

const PolkadotTreasuryContext = createContext();

export default function PolkadotTreasuryProvider({ children }) {
  const api = useContextApi();
  const {
    treasuryAccount,
    relayChainFree,
    native: nativeTreasuryBalance,
    nativeLoading: isNativeTreasuryBalanceLoading,
    usdt: usdtTreasuryBalance,
    usdtLoading: isUsdtTreasuryBalanceLoading,
    usdc: usdcTreasuryBalance,
    usdcLoading: isUsdcTreasuryBalanceLoading,
  } = usePolkadotTreasuryTotal(api);

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
    <PolkadotTreasuryContext.Provider
      value={{
        treasuryAccount,
        relayChainFree,
        nativeTreasuryBalance,
        isNativeTreasuryBalanceLoading,
        dotTreasuryBalanceOnAssetHub,
        isDotTreasuryBalanceOnAssetHubLoading,
        fellowshipTreasuryDotBalance,
        isFellowshipTreasuryDotBalanceLoading,
        fellowshipSalaryUsdtBalance,
        isFellowshipSalaryUsdtBalanceLoading,
        usdtTreasuryBalance,
        isUsdtTreasuryBalanceLoading,
        usdcTreasuryBalance,
        isUsdcTreasuryBalanceLoading,
        loanBifrostDotBalance: 10000000000000000,
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
    </PolkadotTreasuryContext.Provider>
  );
}

export function usePolkadotTreasury() {
  return useContext(PolkadotTreasuryContext);
}
