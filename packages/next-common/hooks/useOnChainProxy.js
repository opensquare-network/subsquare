import { useContextApi } from "next-common/context/api";
import { useUser } from "next-common/context/user";
import { isSameAddress } from "next-common/utils";
import useCall from "next-common/utils/hooks/useCall";
import { useMemo } from "react";

export default function useOnChainProxyInfo(address) {
  const api = useContextApi();
  const user = useUser();
  const { value: proxyInfo } = useCall(api?.query?.proxy?.proxies, [address]);
  return useMemo(() => {
    if (!proxyInfo || !user) {
      return null;
    }
    const [proxies] = proxyInfo;
    return (proxies || []).find((proxy) =>
      isSameAddress(proxy.delegate.toString(), user?.address),
    );
  }, [proxyInfo, user]);
}
