import { useRelayHeight } from "next-common/context/relayInfo";
import { useCoretimeSaleInitHeight } from "next-common/context/coretime/sale/provider";
import useCoretimeSaleStart from "next-common/hooks/coretime/useCoretimeSaleStart";

export function useIsCoretimeSaleInterludePhase() {
  const chainHeight = useRelayHeight();
  const saleStartHeight = useCoretimeSaleStart();
  const initHeight = useCoretimeSaleInitHeight();

  return chainHeight >= initHeight && chainHeight < saleStartHeight;
}
