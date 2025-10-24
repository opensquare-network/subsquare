import { useCoretimeSaleInfo } from "next-common/context/coretime/sale/provider";
import { useCoretimeSaleStartWithRCBlockNumber } from "next-common/hooks/coretime/useCoretimeSaleStart";

export default function useCoretimeCustomizedSaleInfo() {
  const info = useCoretimeSaleInfo();
  const saleStart = useCoretimeSaleStartWithRCBlockNumber();
  return {
    ...info,
    saleStart,
    leadinLength: info.leadinLength,
  };
}
