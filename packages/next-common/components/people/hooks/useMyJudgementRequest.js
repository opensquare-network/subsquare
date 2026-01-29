import { backendApi } from "next-common/services/nextApi";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useCallback, useEffect, useState } from "react";

export default function useMyJudgementRequest() {
  const realAddress = useRealAddress();
  const [value, setValue] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (!realAddress) {
      setValue(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { result } = await backendApi.fetch(
        `people/identities/${realAddress}/active-request`,
      );
      if (result) {
        setValue(result);
        return;
      }
      setValue(null);
    } finally {
      setLoading(false);
    }
  }, [realAddress]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return {
    value,
    loading,
    fetch,
  };
}
