import { useContextApi } from "next-common/context/api";

export default function useSpendPeriod(pallet) {
  const api = useContextApi();

  if (!api || !pallet) {
    return null;
  }

  return api?.consts?.[pallet]?.spendPeriod?.toNumber() || null;
}
