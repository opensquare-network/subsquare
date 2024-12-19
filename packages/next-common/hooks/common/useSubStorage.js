import { useContextApi } from "next-common/context/api";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createGlobalState } from "react-use";
import { useChain } from "next-common/context/chain";

const subs = {};

const useCachedResult = createGlobalState({});

export default function useSubStorage(
  pallet,
  storage,
  params = [],
  options = {}, // callback or api
) {
  const contextApi = useContextApi();
  const { callback, api = contextApi } = options;
  const [cachedResult, setCachedResult] = useCachedResult();
  const [loading, setLoading] = useState(true);
  const chain = useChain();

  const filteredParams = (Array.isArray(params) ? params : [params]).filter(
    Boolean,
  );
  const key = useMemo(() => {
    return `${chain}-${pallet}-${storage}-${filteredParams
      .map(JSON.stringify)
      .join("-")}`;
  }, [chain, pallet, storage, filteredParams]);
  const result = cachedResult[key];

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

    try {
      subs[key].unsub = await queryStorage(
        ...filteredParams,
        (subscribeResult) => {
          callback?.(subscribeResult);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api, pallet, storage, ...filteredParams, key, callback]);

  useEffect(() => {
    if (result && callback) {
      callback(result);
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!api) {
      return;
    }

    subscribe();

    return () => {
      if (subs[key]) {
        subs[key].count--;

        if (subs[key].count === 0) {
          subs[key].unsub?.();
          delete subs[key];

          setCachedResult((val) => {
            delete val[key];
            return val;
          });
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api, key, subscribe]);

  return { loading, result };
}
