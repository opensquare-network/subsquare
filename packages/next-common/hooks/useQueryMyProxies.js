import { useUser } from "next-common/context/user";
import nextApi from "next-common/services/nextApi";
import { useAsync } from "react-use";

export default function useQueryMyProxied() {
  const user = useUser();
  const { value, loading } = useAsync(() => {
    if (!user?.address) {
      return [];
    }
    return nextApi.fetch("proxies", {
      delegatee: user?.address,
    });
  }, [user?.address]);

  const proxies = value?.result ?? [];

  return { proxies, loading };
}
