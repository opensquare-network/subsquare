import useApi from "next-common/utils/hooks/useApi";

export default function useUndecidingTimeout() {
  const api = useApi();

  if (api) {
    return api.consts.referenda.undecidingTimeout.toNumber();
  }

  return null;
}
