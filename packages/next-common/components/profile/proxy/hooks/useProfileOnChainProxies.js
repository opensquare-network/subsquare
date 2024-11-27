import useSubStorage from "next-common/hooks/common/useSubStorage";

export default function useProfileOnChainProxies(address) {
  const { result, loading } = useSubStorage("proxy", "proxies", [address]);

  return { proxies: result?.toJSON(), loading };
}
