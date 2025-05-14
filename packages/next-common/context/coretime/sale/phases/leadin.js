import useCoretimeSale, {
  useCoretimeSaleStart,
} from "next-common/context/coretime/sale/provider";
import useChainOrScanHeight from "next-common/hooks/height";

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
  const chainHeight = useChainOrScanHeight();

  return (
    chainHeight >= saleStartHeight &&
    chainHeight < saleStartHeight + leadinLength
  );
}
