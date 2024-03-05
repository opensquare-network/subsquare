import { useContextApi } from "next-common/context/api";

export default function useMaxDeposits() {
  const api = useContextApi();

  if (api?.consts?.democracy?.maxDeposits) {
    return api.consts.democracy.maxDeposits.toNumber();
  }

  return Number.POSITIVE_INFINITY;
}
