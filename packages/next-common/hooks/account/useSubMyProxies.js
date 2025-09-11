import useRealAddress from "next-common/utils/hooks/useRealAddress";
import useSubStorage from "next-common/hooks/common/useSubStorage";

export default function useSubMyProxies() {
  const address = useRealAddress();
  const { result, loading } = useSubStorage("proxy", "proxies", [address]);

  return { proxies: result?.toJSON(), loading };
}
