import { useChain, useChainSettings } from "next-common/context/chain";
import getChainSettings from "next-common/utils/consts/settings";
import { getRelayChain, isCollectivesChain } from "next-common/utils/chain";

// Core fellowship on Collectives measures time in relay chain blocks, so its
// period params should be converted with the relay chain block time (6s)
// instead of the local collectives block time (12s).
export default function useCoreFellowshipBlockTime() {
  const chain = useChain();
  const { blockTime } = useChainSettings();

  if (isCollectivesChain(chain)) {
    return getChainSettings(getRelayChain(chain))?.blockTime ?? blockTime;
  }

  return blockTime;
}
