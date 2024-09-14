import { useContextApi } from "next-common/context/api";
import { useState } from "react";
import { useAsync } from "react-use";

export function useStorage(pallet, storage, params = [], options = {}) {
  const contextApi = useContextApi();
  const { api = contextApi } = options;
  const [loading, setLoading] = useState(true);

  const { value: result } = useAsync(async () => {
    const queryStorage = api?.query[pallet]?.[storage];

    if (!queryStorage) {
      setLoading(false);
      return;
    }

    let result;
    try {
      result = await queryStorage(...params);
    } finally {
      setLoading(false);
    }

    return result;
  }, [api, pallet, storage, ...params]);

  return { loading, result };
}
