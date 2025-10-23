import useCoretimeSale from "next-common/context/coretime/sale/provider";
import useCoretimeChainOrScanHeight from "next-common/hooks/coretime/scanHeight";
import useCoretimeSaleStart from "next-common/hooks/coretime/useCoretimeSaleStart";
import useIsCoretimeUseRCBlockNumber from "next-common/hooks/coretime/useIsCoretimeUseRCBlockNumber";

export function useCoretimeSaleLeadinLength() {
  const sale = useCoretimeSale();
  const { info: { leadinLength } = {} } = sale;
  const isUseRCBlockNumber = useIsCoretimeUseRCBlockNumber(sale.id);
  return isUseRCBlockNumber ? parseInt(leadinLength / 2 + "") : leadinLength;
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
