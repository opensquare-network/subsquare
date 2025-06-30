import { useContextApi } from "next-common/context/api";
import { useEffect, useState } from "react";

export default function useSubPalletStorage(
  pallet,
  storage,
  params = [],
  options = {}, // api
) {
  const contextApi = useContextApi();
  const { api = contextApi } = options;
  const [isLoading, setIsLoading] = useState(true);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!api || !api.query?.[pallet]?.[storage]) {
      setIsLoading(false);
      return;
    }

    let unsub;
    const normalizedParams = Array.isArray(params) ? params : [params];
    api.query[pallet][storage](...normalizedParams, (subscribeResult) =>
      setResult(subscribeResult),
    )
      .then((result) => (unsub = result))
      .finally(() => setIsLoading(false));

    return () => {
      if (unsub) {
        unsub();
      }
    };
  }, [api, pallet, storage, params]);

  return { isLoading, result };
}
