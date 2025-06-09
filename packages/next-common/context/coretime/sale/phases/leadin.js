import useCoretimeSale, {
  useCoretimeSaleStart,
} from "next-common/context/coretime/sale/provider";
import useCoretimeChainOrScanHeight from "next-common/hooks/coretime/scanHeight";

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
  const chainHeight = useCoretimeChainOrScanHeight();

  return (
    chainHeight >= saleStartHeight &&
    chainHeight < saleStartHeight + leadinLength
  );
}
