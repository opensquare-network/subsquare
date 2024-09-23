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

const PolkadotTreasurySummaryContext = createContext();

function useAssetBalance(asset) {
  return useSubscribeAssetHubAssets(asset.id, StatemintTreasuryAccount)?.free;
}

const getAssetBySymbol = (symbol) =>
  StatemintAssets.find((asset) => asset.symbol === symbol);

export function PolkadotTreasurySummaryProvider({ children }) {
  const [DOTBalance, setDOTBalance] = useState(0);

  const [isTotalAssetsLoading, setIsTotalAssetsLoading] = useState(true);

  const api = useContextApi();
  const relayChainFree = useTreasuryFree(api);

  const { free: fellowshipFree, isLoading: isFellowshipLoading } =
    useSubscribeFellowshipTreasuryFree(StatemintFellowShipTreasuryAccount);

  const { free: multiAssetsFree, isLoading: isMultiAssetsLoading } =
    useSubscribeFellowshipTreasuryFree(StatemintTreasuryAccount);

  const usdtAsset = getAssetBySymbol("USDt");
  const usdcAsset = getAssetBySymbol("USDC");

  const USDtBalance = useAssetBalance(usdtAsset);
  const USDCBalance = useAssetBalance(usdcAsset);

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
        USDtBalance,
        USDCBalance,
        DOTBalance,
        isFellowshipLoading,
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
