import useCoretimeSale from "next-common/context/coretime/sale/provider";

export default function useCoretimeSaleInterludeEndHeight() {
  const sale = useCoretimeSale();
  const { info: { saleStart } = {} } = sale;
  return saleStart;
}
