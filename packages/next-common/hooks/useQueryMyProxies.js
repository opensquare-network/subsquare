import { useUser } from "next-common/context/user";
import { backendApi } from "next-common/services/nextApi";
import { useAsync } from "react-use";

export default function useQueryMyProxied() {
  const user = useUser();
  const { value: proxies = [], loading } = useAsync(async () => {
    if (!user?.address) {
      return [];
    }

    const { result } = await backendApi.fetch("proxies", {
      delegatee: user?.address,
      noDelay: true,
    });

    return result || [];
  }, [user?.address]);

  return { proxies, loading };
}
