import useChainOrScanHeight from "next-common/hooks/height";
import {
  useCoretimeSaleInitHeight,
  useCoretimeSaleStart,
} from "next-common/context/coretime/sale/provider";

export function useIsCoretimeSaleInterludePhase() {
  const chainHeight = useChainOrScanHeight();
  const saleStartHeight = useCoretimeSaleStart();
  const initHeight = useCoretimeSaleInitHeight();

  return chainHeight >= initHeight && chainHeight < saleStartHeight;
}
