import { createContext, useContext, useMemo } from "react";
import getChainSettings from "../utils/consts/settings";

const ChainContext = createContext(process.env.NEXT_PUBLIC_CHAIN);

export default function ChainProvider({ chain, children }) {
  return (
    <ChainContext.Provider value={chain}>{children}</ChainContext.Provider>
  );
}

export function useChain() {
  return useContext(ChainContext);
}

export function useChainSettings(blockHeight = null) {
  const chain = useChain();
  return useMemo(
    () => getChainSettings(chain, blockHeight),
    [chain, blockHeight],
  );
}

export function useDecimals() {
  const node = useChainSettings();
  return node.decimals;
}

export function useSymbol() {
  const node = useChainSettings();
  return node.symbol;
}

// vote token symbol is different with system token symbol in some chains
export function useVoteSymbol() {
  const { symbol, voteSymbol } = useChainSettings();
  return voteSymbol || symbol;
}
