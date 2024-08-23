import { useContextApi } from "next-common/context/api";
import { useCallback, useEffect, useState } from "react";
import { createGlobalState } from "react-use";

let subscribing = false;
let unsub;
let count = 0;

const useCachedResult = createGlobalState({});

export function useStorage(
  pallet = "",
  storage = "",
  params,
  { subscribe = false } = {},
) {
  const api = useContextApi();
  const [cachedResult, setCachedResult] = useCachedResult();
  const [loading, setLoading] = useState(true);

  const filteredParams = (Array.isArray(params) ? params : [params]).filter(
    Boolean,
  );

  const cacheKey = `${pallet}-${storage}-${filteredParams.join("-")}`;
  const result = cachedResult[cacheKey];

  const fetch = useCallback(() => {
    if (!api || subscribing) {
      return;
    }

    if (!api?.query[pallet]?.[storage]) {
      setLoading(false);
      return;
    }

    const meta = api?.query[pallet]?.[storage].meta;
    if (meta.type?.isMap && filteredParams.length !== 1) {
      setLoading(false);
      return;
    }

    const storageQueryFn = api.query[pallet][storage];

    let promise;

    if (subscribe) {
      subscribing = true;
      promise = storageQueryFn(...filteredParams, (args) => {
        setCachedResult((val) => {
          return {
            ...val,
            [cacheKey]: args,
          };
        });
      }).then((fn) => {
        unsub = fn;
      });
    } else {
      promise = storageQueryFn(...filteredParams).then((resp) => {
        setCachedResult((val) => {
          return {
            ...val,
            [cacheKey]: resp,
          };
        });
      });
    }

    promise.finally(() => {
      setLoading(false);
    });
  }, [api, pallet, storage, filteredParams, subscribe, cacheKey]);

  useEffect(() => {
    if (!result) {
      fetch();
    }

    if (subscribe) {
      count++;
    }

    return () => {
      if (subscribe) {
        count--;

        if (count === 0) {
          subscribing = false;

          setCachedResult((val) => {
            delete val[cacheKey];
            return val;
          });

          if (unsub) {
            unsub();
            unsub = null;
          }
        }
      }
    };
  }, [result, fetch, subscribe, cacheKey]);

  return { result, loading };
}
