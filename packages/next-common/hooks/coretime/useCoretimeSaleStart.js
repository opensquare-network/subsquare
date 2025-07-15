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

export function useCoretimeSaleFixedStart() {
  const sale = useCoretimeSale();
  const isUseRCBlockNumber = useIsCoretimeUseRCBlockNumber(sale.id);
  const saleStart = useCoretimeSaleStart();
  const { info: { saleStart: saleStartFromSale, leadinLength } = {} } = sale;
  if (!isUseRCBlockNumber) {
    return saleStartFromSale + leadinLength;
  } else {
    return parseInt(saleStart + leadinLength / 2 + "");
  }
}
