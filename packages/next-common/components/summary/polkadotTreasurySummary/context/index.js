import { createContext, useContext, useState, useEffect } from "react";
import { useSubscribeAssetHubAssets } from "../hook/useSubscribeAssetHubAssets";
import { useSubscribeFellowshipTreasuryFree } from "../hook/useSubscribeAssetHubTreasuryFree";
import {
  StatemintTreasuryAccount,
  StatemintAssets,
  StatemintFellowShipTreasuryAccount,
} from "next-common/hooks/treasury/useAssetHubTreasuryBalance";
import BigNumber from "bignumber.js";
import useTreasuryFree from "next-common/utils/hooks/useTreasuryFree";
import { useContextApi } from "next-common/context/api";
import { isNil } from "lodash-es";

const PolkadotTreasurySummaryContext = createContext();

function useAssetBalance(asset) {
  return useSubscribeAssetHubAssets(asset.id, StatemintTreasuryAccount)?.free;
}

const getAssetBySymbol = (symbol) =>
  StatemintAssets.find((asset) => asset.symbol === symbol);

export function PolkadotTreasurySummaryProvider({ children }) {
  const [balances, setBalances] = useState({
    relayChainFree: null,
    multiAssetsFree: null,
    fellowshipFree: null,
    USDtBalance: 0,
    USDCBalance: 0,
    DOTBalance: 0,
  });

  const [isLoading, setIsLoading] = useState({
    isTotalAssetsLoading: true,
    isFellowshipLoading: true,
    isMultiAssetsLoading: true,
  });

  const api = useContextApi();
  const relayChainFreeBalance = useTreasuryFree(api);

  const { free: fellowshipFreeBalance, isLoading: isFellowshipLoading } =
    useSubscribeFellowshipTreasuryFree(StatemintFellowShipTreasuryAccount);

  const { free: multiAssetsFreeBalance, isLoading: isMultiAssetsLoading } =
    useSubscribeFellowshipTreasuryFree(StatemintTreasuryAccount);

  const usdtAsset = getAssetBySymbol("USDt");
  const usdcAsset = getAssetBySymbol("USDC");

  const usdtBalance = useAssetBalance(usdtAsset);
  const usdcBalance = useAssetBalance(usdcAsset);

  useEffect(() => {
    setBalances((prev) => ({
      ...prev,
      relayChainFree: relayChainFreeBalance || prev.relayChainFree,
      multiAssetsFree: multiAssetsFreeBalance || prev.multiAssetsFree,
      fellowshipFree: fellowshipFreeBalance || prev.fellowshipFree,
      USDtBalance: usdtBalance || prev.USDtBalance,
      USDCBalance: usdcBalance || prev.USDCBalance,
    }));
  }, [
    relayChainFreeBalance,
    multiAssetsFreeBalance,
    fellowshipFreeBalance,
    usdtBalance,
    usdcBalance,
  ]);

  useEffect(() => {
    const { relayChainFree, multiAssetsFree, fellowshipFree } = balances;
    if (relayChainFree && multiAssetsFree && fellowshipFree) {
      const totalDOTBalance = BigNumber(relayChainFree)
        .plus(multiAssetsFree)
        .plus(fellowshipFree);
      setBalances((prev) => ({ ...prev, DOTBalance: totalDOTBalance }));
    }
  }, [
    balances.relayChainFree,
    balances.multiAssetsFree,
    balances.fellowshipFree,
  ]);

  useEffect(() => {
    setIsLoading({
      isFellowshipLoading,
      isMultiAssetsLoading,
      isTotalAssetsLoading:
        isFellowshipLoading ||
        isMultiAssetsLoading ||
        Object.values(balances).some(isNil),
    });
  }, [isFellowshipLoading, isMultiAssetsLoading, balances]);

  return (
    <PolkadotTreasurySummaryContext.Provider
      value={{
        ...balances,
        ...isLoading,
      }}
    >
      {children}
    </PolkadotTreasurySummaryContext.Provider>
  );
}

export function usePolkadotTreasurySummary() {
  return useContext(PolkadotTreasurySummaryContext);
}
