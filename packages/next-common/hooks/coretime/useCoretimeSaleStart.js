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
  const { relaySaleStartIndexer, info, id } = useCoretimeSale();
  const isUseRCBlockNumber = useIsCoretimeUseRCBlockNumber(id);

  if (!isUseRCBlockNumber) {
    return info.saleStart;
  }

  return relaySaleStartIndexer?.blockHeight ?? info.saleStart;
}

export function useCoretimeSaleFixedStart() {
  const sale = useCoretimeSale();
  const saleStart = useCoretimeSaleStartWithRCBlockNumber();
  const { info: { leadinLength } = {} } = sale;

  return saleStart + leadinLength;
}
