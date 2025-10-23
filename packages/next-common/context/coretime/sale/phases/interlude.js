import useAlwaysRelayHeight from "next-common/hooks/useAlwaysRelayHeight";
import { useCoretimeSaleInitHeight } from "next-common/context/coretime/sale/provider";
import useCoretimeSaleStart from "next-common/hooks/coretime/useCoretimeSaleStart";

export function useIsCoretimeSaleInterludePhase() {
  const chainHeight = useAlwaysRelayHeight();
  const saleStartHeight = useCoretimeSaleStart();
  const initHeight = useCoretimeSaleInitHeight();

  return chainHeight >= initHeight && chainHeight < saleStartHeight;
}
