import { useCoretimeSaleInfo } from "next-common/context/coretime/sale/provider";
import useCoretimeSaleStart from "next-common/hooks/coretime/useCoretimeSaleStart";

export default function useCoretimeCustomizedSaleInfo() {
  const info = useCoretimeSaleInfo();
  const saleStart = useCoretimeSaleStart();
  return {
    ...info,
    saleStart,
    leadinLength: info.leadinLength,
  };
}
