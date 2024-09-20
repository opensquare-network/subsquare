import { createContext, useContext, useState } from "react";

const PolkadotTreasurySummaryContext = createContext();

export function PolkadotTreasurySummaryProvider({ children }) {
  const [relayChainFree, setRelayChainDOTFree] = useState(null);
  const [multiAssetsFree, setMultiAssetsFree] = useState(null);
  const [fellowshipFree, setFellowshipFree] = useState(null);
  const [USDtBalance, setUSDtBalance] = useState(0);
  const [USDCBalance, setUSDCBalance] = useState(0);
  const [DOTBalance, setDOTBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <PolkadotTreasurySummaryContext.Provider
      value={{
        relayChainFree,
        setRelayChainDOTFree,
        multiAssetsFree,
        setMultiAssetsFree,
        fellowshipFree,
        setFellowshipFree,
        USDtBalance,
        setUSDtBalance,
        USDCBalance,
        setUSDCBalance,
        DOTBalance,
        setDOTBalance,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </PolkadotTreasurySummaryContext.Provider>
  );
}

export function usePolkadotTreasurySummary() {
  return useContext(PolkadotTreasurySummaryContext);
}
