import { useContextApi } from "next-common/context/api";
import useCall from "next-common/utils/hooks/useCall";
import useRealAddress from "next-common/utils/hooks/useRealAddress";

export default function useMyOnChainProxies() {
  const address = useRealAddress();
  const api = useContextApi();
  const { value, loaded } = useCall(api?.query.proxy?.proxies, [address]);

  return { proxies: value?.toJSON(), loading: !loaded };
}

