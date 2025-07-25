import { backendApi } from "next-common/services/nextApi";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useAsync } from "react-use";

export default function useQueryMyProxied() {
  const realAddress = useRealAddress();
  const { value: proxies = [], loading } = useAsync(async () => {
    if (!realAddress) {
      return [];
    }

    const { result } = await backendApi.fetch("proxies", {
      delegatee: realAddress,
      noDelay: true,
    });

    return result || [];
  }, [realAddress]);

  return { proxies, loading };
}
