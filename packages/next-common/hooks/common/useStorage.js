import { useContextApi } from "next-common/context/api";
import { useCallback, useEffect, useState } from "react";
import { createGlobalState } from "react-use";

let subscribing = false;
let unsub;

const useResult = createGlobalState();

export function useStorage(
  pallet,
  storage,
  params,
  { subscribe = false } = {},
) {
  const api = useContextApi();
  const [result, setResult] = useResult();
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(() => {
    if (!api || subscribing) {
      return;
    }

    if (!api?.query[pallet]?.[storage]) {
      setLoading(false);
      return;
    }

    params = Array.isArray(params) ? params : [params];

    const filteredParams = params.filter(Boolean);
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
        setResult(args);
      }).then((fn) => {
        unsub = fn;
      });
    } else {
      promise = storageQueryFn(...filteredParams).then(setResult);
    }

    promise.finally(() => {
      setLoading(false);
    });
  }, [api, pallet, storage, params, subscribe]);

  useEffect(() => {
    if (!result) {
      fetch();
    }

    return () => {
      unsub?.();
      subscribing = false;
    };
  }, [result, fetch]);

  return { result, loading };
}
