import useCoretimeSale, {
  useCoretimeSaleInfo,
} from "next-common/context/coretime/sale/provider";
import useCoretimeSaleStart from "next-common/hooks/coretime/useCoretimeSaleStart";
import useIsCoretimeUseRCBlockNumber from "next-common/hooks/coretime/useIsCoretimeUseRCBlockNumber";

export default function useCoretimeCustomizedSaleInfo() {
  const sale = useCoretimeSale();
  const info = useCoretimeSaleInfo();
  const saleStart = useCoretimeSaleStart();
  const isUseRCBlockNumber = useIsCoretimeUseRCBlockNumber(sale.id);
  return {
    ...info,
    saleStart,
    leadinLength: isUseRCBlockNumber
      ? info.leadinLength / 2
      : info.leadinLength,
  };
}
