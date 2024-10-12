import { useMemo } from "react";
import getChainSettings from "../utils/consts/settings";
import { CHAIN, defaultBlockTime } from "next-common/utils/constants";
import { createStateContext } from "react-use";

const [useChainState, ChainStateProvider] = createStateContext({});

export { useChainState };

export default function ChainProvider({ chain = CHAIN, children }) {
  const initialValue = {
    chain,
    blockTime: getChainSettings(chain).blockTime || defaultBlockTime,
    scanHeight: null,
    latestHeight: null,
    convictionVotingLockPeriod: null,
    democracyLockPeriod: null,
    existentialDeposit: null,
  };

  return (
    <ChainStateProvider initialValue={initialValue}>
      {children}
    </ChainStateProvider>
  );
}

export function useChain() {
  const [{ chain }] = useChainState();
  return chain;
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
