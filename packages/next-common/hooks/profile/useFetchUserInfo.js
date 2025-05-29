import { useCallback, useEffect, useState } from "react";
import nextApi from "next-common/services/nextApi";

export default function useFetchUserInfo(address) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (!address) {
      return;
    }

    setIsLoading(true);
    try {
      const result = await nextApi.fetch(`users/${address}`);

      setUser(result?.result ?? null);
    } catch (e) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return {
    fetch,
    user,
    isLoading,
  };
}
