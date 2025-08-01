import { backendApi } from "next-common/services/nextApi";
import { useAsync } from "react-use";

export default function useQueryMyProxied(address) {
  const { value: proxies = [], loading } = useAsync(async () => {
    if (!address) {
      return [];
    }

    const { result } = await backendApi.fetch("proxies", {
      delegatee: address,
      noDelay: true,
    });

    return result || [];
  }, [address]);

  return { proxies, loading };
}
