import { createGlobalState } from "react-use";
import { useCallback, useEffect, useState } from "react";

const useCachedResult = createGlobalState({});
const subs = {};

export default function useSubStorageWithApi(
  api,
  pallet,
  storage,
  params = [],
  callbackFn,
) {
  const [cachedResult, setCachedResult] = useCachedResult();
  const [loading, setLoading] = useState(true);
  const key = `${pallet}-${storage}-${params.join("-")}`;

  const subscribe = useCallback(async () => {
    if (!subs[key]) {
      subs[key] = {
        unsub: null,
        count: 0,
      };
    } else {
      subs[key].count++;
      setLoading(false);
      return;
    }

    const queryStorage = api?.query[pallet]?.[storage];
    if (!queryStorage) {
      setLoading(false);
      return;
    }

    const meta = queryStorage.meta;
    if (meta.type?.isMap && params.length !== 1) {
      setLoading(false);
      return;
    }

    try {
      subs[key].unsub = await queryStorage(
        ...params,
        (subscribeResult) => {
          callbackFn?.(subscribeResult);

          setCachedResult((val) => {
            return {
              ...val,
              [key]: subscribeResult,
            };
          });
        },
      );
    } finally {
      setLoading(false);
    }
  }, [api, pallet, storage, ...params, key, callbackFn]);

  useEffect(() => {
    if (!api) {
      return;
    }

    subscribe();
    // todo: 1. subscribe
    // todo: 2. return unsubscribe function

  }, [api, key])
}
