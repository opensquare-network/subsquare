import { useContextApi } from "next-common/context/api";
import { isSameAddress } from "next-common/utils";
import useCall from "next-common/utils/hooks/useCall";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useMemo } from "react";

export default function useOnChainProxyInfo(address) {
  const api = useContextApi();
  const realAddress = useRealAddress();
  const { value: proxyInfo } = useCall(api?.query?.proxy?.proxies, [address]);
  return useMemo(() => {
    if (!proxyInfo || !realAddress) {
      return null;
    }
    const [proxies] = proxyInfo;
    return (proxies || []).find((proxy) =>
      isSameAddress(proxy.delegate.toString(), realAddress),
    );
  }, [proxyInfo, realAddress]);
}
