import useCoretimeSale from "next-common/context/coretime/sale/provider";
import useIsCoretimeUseRCBlockNumber from "next-common/hooks/coretime/useIsCoretimeUseRCBlockNumber";

export default function useCoretimeSaleStart() {
  const { relaySaleStartIndexer, info, id } = useCoretimeSale();
  const isUseRCBlockNumber = useIsCoretimeUseRCBlockNumber(id);

  if (!isUseRCBlockNumber) {
    return info.saleStart;
  }

  return relaySaleStartIndexer?.blockHeight ?? info.saleStart;
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
  const saleStart = useCoretimeSaleStart();
  const { info: { leadinLength } = {} } = sale;

  return saleStart + leadinLength;
}
