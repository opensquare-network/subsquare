import { useRelayChainLatestHeight } from "next-common/hooks/relayScanHeight";
import { useCoretimeSaleRelayIndexerHeight } from "next-common/context/coretime/sale/provider";
import useCoretimeSaleStart from "next-common/hooks/coretime/useCoretimeSaleStart";

export function useIsCoretimeSaleInterludePhase() {
  const chainHeight = useRelayChainLatestHeight();
  const saleStartHeight = useCoretimeSaleStart();
  const relayIndexerHeight = useCoretimeSaleRelayIndexerHeight();

  return chainHeight >= relayIndexerHeight && chainHeight < saleStartHeight;
}
