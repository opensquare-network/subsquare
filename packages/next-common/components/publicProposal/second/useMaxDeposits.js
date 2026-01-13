import { useConditionalContextApi } from "next-common/context/migration/conditionalApi";

export default function useMaxDeposits() {
  const api = useConditionalContextApi();

  if (api?.consts?.democracy?.maxDeposits) {
    return api.consts.democracy.maxDeposits.toNumber();
  }

  return Number.POSITIVE_INFINITY;
}
