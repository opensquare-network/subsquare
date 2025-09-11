import { useEffect, useState, useCallback } from "react";
import { backendApi } from "next-common/services/nextApi";

export default function useMultisigAccount(realAddress) {
  const [multisigs, setMultisigs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const fetchMultisigs = useCallback(async () => {
    try {
      setIsLoading(true);
      const { result } = await backendApi.fetch(
        `users/${realAddress}/multisigs`,
      );
      setMultisigs(result);
      setTotal(result?.length || 0);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [realAddress]);

  useEffect(() => {
    fetchMultisigs();
  }, [fetchMultisigs]);

  const refresh = useCallback(() => {
    fetchMultisigs();
  }, [fetchMultisigs]);

  return {
    refresh,
    isLoading,
    total,
    multisigs,
  };
}
