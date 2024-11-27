import nextApi from "next-common/services/nextApi";
import { useAsync } from "react-use";

export default function useAllServerProxies() {
  const { value: proxies = [], loading } = useAsync(async () => {
    const { result } = await nextApi.fetch("proxies");

    return result || [];
  }, []);

  return { proxies, loading };
}
