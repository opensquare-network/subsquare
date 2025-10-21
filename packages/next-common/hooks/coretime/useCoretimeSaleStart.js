import useCoretimeSale from "next-common/context/coretime/sale/provider";

export default function useCoretimeSaleStart() {
  const sale = useCoretimeSale();
  const { info } = sale || {};
  return info.saleStart;
}

export function useCoretimeSaleFixedStart() {
  const sale = useCoretimeSale();
  const { info: { saleStart: saleStartFromSale, leadinLength } = {} } = sale;
  return saleStartFromSale + leadinLength;
}
