import useCoretimeSale from "next-common/context/coretime/sale/provider";
import useIsCoretimeUseRCBlockNumber from "next-common/hooks/coretime/useIsCoretimeUseRCBlockNumber";

export default function useCoretimeSaleStart() {
  const sale = useCoretimeSale();
  const {
    id,
    info,
    initIndexer: { blockHeight },
    configuration: { interludeLength } = {},
  } = sale || {};
  const isUseRCBlockNumber = useIsCoretimeUseRCBlockNumber(id);
  if (!isUseRCBlockNumber) {
    return info.saleStart;
  }

  return parseInt(blockHeight + interludeLength / 2 + "");
}

export function useCoretimeSaleStartWithRCBlockNumber() {
  const sale = useCoretimeSale();
  return sale.info.saleStart;
}

export function useCoretimeSaleFixedStart() {
  const sale = useCoretimeSale();
  const { info: { saleStart: saleStartFromSale, leadinLength } = {} } = sale;
  return saleStartFromSale + leadinLength;
}
