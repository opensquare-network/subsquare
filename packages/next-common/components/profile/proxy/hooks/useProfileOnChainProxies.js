import { useContextApi } from "next-common/context/api";
import useCall from "next-common/utils/hooks/useCall";

export default function useProfileOnChainProxies(address) {
  const api = useContextApi();
  const { value, loaded } = useCall(api?.query.proxy?.proxies, [address]);

  return { proxies: value?.toJSON(), loading: !loaded };
}
