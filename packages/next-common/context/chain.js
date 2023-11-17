import { createContext, useContext } from "react";
import getChainSettings from "../utils/consts/settings";
import democracy from "../utils/consts/menu/democracy";
import treasury from "../utils/consts/menu/treasury";
import council from "../utils/consts/menu/council";

const ChainContext = createContext(process.env.NEXT_PUBLIC_CHAIN);

export default function ChainProvider({ chain, children }) {
  return (
    <ChainContext.Provider value={chain}>{children}</ChainContext.Provider>
  );
}

export function useChain() {
  return useContext(ChainContext);
}

export function useChainSettings() {
  const chain = useChain();
  return getChainSettings(chain);
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

export function useMenuHasTreasuryBounties() {
  const chain = useChain();
  const bountiesConfig = treasury.items.find(
    ({ value }) => value === "bounties",
  );
  return bountiesConfig && !bountiesConfig.excludeToChains.includes(chain);
}

export function useMenuHasTreasuryChildBounties() {
  const chain = useChain();
  const childBountiesConfig = treasury.items.find(
    ({ value }) => value === "child-bounties",
  );
  return (
    childBountiesConfig && !childBountiesConfig.excludeToChains.includes(chain)
  );
}

export function useMenuHasTreasuryTips() {
  const chain = useChain();
  const tipsConfig = treasury.items.find(({ value }) => value === "tips");
  return tipsConfig && !tipsConfig.excludeToChains.includes(chain);
}

export function useMenuHasDemocracyExternal() {
  const chain = useChain();
  const tipsConfig = democracy.items.find(
    ({ value }) => value === "democracyExternals",
  );
  return tipsConfig && !tipsConfig.excludeToChains.includes(chain);
}

export function useMenuHasCouncil() {
  const chain = useChain();
  return !council.excludeToChains.includes(chain);
}

export function useMenuHasTechComm() {
  const chainSettings = useChainSettings();
  return chainSettings.hasTechComm !== false;
}
