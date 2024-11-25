import { useUser } from "next-common/context/user";
import nextApi from "next-common/services/nextApi";
import { useAsync } from "react-use";

export default function useQueryMyProxied() {
  const user = useUser();
  const { value, loading } = useAsync(async () => {
    if (!user?.address) {
      return [];
    }

    const { result } = await nextApi.fetch("proxies", {
      delegatee: user?.address,
      noDelay: true,
    });

    return result || [];
  }, [user?.address]);

  return { proxies: value, loading };
}
