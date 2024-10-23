import useCoretimeActiveSale from "next-common/context/coretime/sale/provider";

export default function useCoretimeSale() {
  const [sale] = useCoretimeActiveSale();
  return sale;
}
