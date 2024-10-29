import useCoretimeSale, { useCoretimeSaleStart } from "next-common/context/coretime/sale/provider";
import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";
import { useSelector } from "react-redux";

export function useCoretimeSaleLeadinLength() {
  const sale = useCoretimeSale();
  const { info: { leadinLength } = {} } = sale;
  return leadinLength;
}

export function useCoretimeSaleLeadinEnd() {
  const saleStartHeight = useCoretimeSaleStart();
  const leadinLength = useCoretimeSaleLeadinLength();

  return saleStartHeight + leadinLength;
}

export function useIsCoretimeSaleLeadinPhase() {
  const saleStartHeight = useCoretimeSaleStart();
  const leadinLength = useCoretimeSaleLeadinLength();
  const chainHeight = useSelector(chainOrScanHeightSelector);

  return chainHeight >= saleStartHeight && chainHeight < saleStartHeight + leadinLength;
}
