import { createContext, useContext, useState, useEffect } from "react";
import useSubscribeAssetHubAssets from "next-common/hooks/assetHub/useSubscribeAssetHubAssets";
import { useSubscribeFellowshipTreasuryFree } from "../hook/useSubscribeAssetHubTreasuryFree";
import {
  StatemintTreasuryAccount,
  getAssetBySymbol,
  StatemintFellowShipTreasuryAccount,
} from "next-common/hooks/treasury/useAssetHubTreasuryBalance";
import BigNumber from "bignumber.js";
import useTreasuryFree from "next-common/utils/hooks/useTreasuryFree";
import { useContextApi } from "next-common/context/api";
import useSubscribeFellowshipSalaryBalance from "../hook/useSubscribeFellowshipSalaryBalance";

const PolkadotTreasurySummaryContext = createContext();

function useTreasuryAccountAssetBalance(symbol) {
  const asset = getAssetBySymbol(symbol);
  return useSubscribeAssetHubAssets(asset.id, StatemintTreasuryAccount);
}

export function PolkadotTreasurySummaryProvider({ children }) {
  const [DOTBalance, setDOTBalance] = useState(0);

  const [isTotalAssetsLoading, setIsTotalAssetsLoading] = useState(true);

  const api = useContextApi();
  const relayChainFree = useTreasuryFree(api);

  const { free: fellowshipFree, isLoading: isFellowshipLoading } =
    useSubscribeFellowshipTreasuryFree(StatemintFellowShipTreasuryAccount);

  const {
    balance: fellowshipSalaryUsdtBalance,
    isLoading: isFellowshipSalaryUsdtBalanceLoading,
  } = useSubscribeFellowshipSalaryBalance("USDt");

  const { free: multiAssetsFree, isLoading: isMultiAssetsLoading } =
    useSubscribeFellowshipTreasuryFree(StatemintTreasuryAccount);

  const { balance: USDtBalance } = useTreasuryAccountAssetBalance("USDt");
  const { balance: USDCBalance } = useTreasuryAccountAssetBalance("USDC");

  useEffect(() => {
    if (relayChainFree && multiAssetsFree && fellowshipFree) {
      const totalDOTBalance = BigNumber(relayChainFree)
        .plus(multiAssetsFree)
        .plus(fellowshipFree);
      setDOTBalance(totalDOTBalance);
      setIsTotalAssetsLoading(false);
    }
  }, [relayChainFree, multiAssetsFree, fellowshipFree]);

  return (
    <PolkadotTreasurySummaryContext.Provider
      value={{
        relayChainFree,
        multiAssetsFree,
        fellowshipFree,
        fellowshipSalaryUsdtBalance,
        USDtBalance,
        USDCBalance,
        DOTBalance,
        isFellowshipLoading,
        isFellowshipSalaryUsdtBalanceLoading,
        isMultiAssetsLoading,
        isTotalAssetsLoading,
      }}
    >
      {children}
    </PolkadotTreasurySummaryContext.Provider>
  );
}

export function usePolkadotTreasurySummary() {
  return useContext(PolkadotTreasurySummaryContext);
}
