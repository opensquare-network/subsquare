import useCoretimeChainOrScanHeight from "next-common/hooks/coretime/scanHeight";
import { useCoretimeSaleInitHeight } from "next-common/context/coretime/sale/provider";
import useCoretimeSaleStart from "next-common/hooks/coretime/useCoretimeSaleStart";

export function useIsCoretimeSaleInterludePhase() {
  const chainHeight = useCoretimeChainOrScanHeight();
  const saleStartHeight = useCoretimeSaleStart();
  const initHeight = useCoretimeSaleInitHeight();

  return chainHeight >= initHeight && chainHeight < saleStartHeight;
}
