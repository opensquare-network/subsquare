import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";
import { useCoretimeSaleInitHeight, useCoretimeSaleStart } from "next-common/context/coretime/sale/provider";
import { useSelector } from "react-redux";

export function useIsCoretimeSaleInterludePhase() {
  const chainHeight = useSelector(chainOrScanHeightSelector);
  const saleStartHeight = useCoretimeSaleStart();
  const initHeight = useCoretimeSaleInitHeight();

  return chainHeight >= initHeight && initHeight < saleStartHeight;
}
