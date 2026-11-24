import { useChain } from "next-common/context/chain";
import useChainOrScanHeight from "next-common/hooks/height";
import { useRelayParentNumber } from "next-common/hooks/relayParentNumber";
import { isCollectivesChain } from "next-common/utils/chain";

// Core fellowship measures time with a block number provider. On Collectives,
// the provider is the relay chain, so member timestamps and demotion/promotion
// params are relay chain block numbers instead of local collectives blocks.
export default function useCoreFellowshipLatestHeight() {
  const chain = useChain();
  const chainHeight = useChainOrScanHeight();
  const relayParentNumber = useRelayParentNumber();

  if (isCollectivesChain(chain)) {
    return relayParentNumber;
  }

  return chainHeight;
}
