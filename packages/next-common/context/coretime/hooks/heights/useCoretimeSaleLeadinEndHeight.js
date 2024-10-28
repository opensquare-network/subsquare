import useCoretimeSale from "next-common/context/coretime/sale/provider";

export default function useCoretimeSaleLeadinEndHeight() {
  const sale = useCoretimeSale();
  const { info: { saleStart, leadinLength } = {} } = sale;
  return saleStart + leadinLength;
}
