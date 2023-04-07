import useApi from "../../../utils/hooks/useApi";

export default function useMaxDeposits() {
  const api = useApi();

  if (api?.consts?.democracy?.maxDeposits) {
    return api.consts.democracy.maxDeposits.toNumber();
  }

  return Number.POSITIVE_INFINITY;
}
