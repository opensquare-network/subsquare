import useCoretimeChainOrScanHeight from "next-common/hooks/coretime/scanHeight";
import {
  useCoretimeSaleInitHeight,
  useCoretimeSaleStart,
} from "next-common/context/coretime/sale/provider";

export function useIsCoretimeSaleInterludePhase() {
  const chainHeight = useCoretimeChainOrScanHeight();
  const saleStartHeight = useCoretimeSaleStart();
  const initHeight = useCoretimeSaleInitHeight();

  return chainHeight >= initHeight && chainHeight < saleStartHeight;
}
