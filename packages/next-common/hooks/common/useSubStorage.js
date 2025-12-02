import { useContextApi } from "next-common/context/api";
import { useCallback, useEffect } from "react";
import useDeepMemo from "../useDeepMemo";
import { createGlobalState } from "react-use";
import { useChain } from "next-common/context/chain";
import { isNil } from "lodash-es";

const subs = {};

const useCachedState = createGlobalState({});

function useCachedResult(key) {
  const [cachedState, setCachedState] = useCachedState();
  const { loading = true, result = undefined } = cachedState[key] || {};

  const setResult = useCallback(
    (result) =>
      setCachedState((val) => ({ ...val, [key]: { result, loading: false } })),
    [key, setCachedState],
  );

  const cleanup = useCallback(() => {
    setCachedState((val) => {
      delete val[key];
      return val;
    });
  }, [key, setCachedState]);

  return {
    loading,
    result,
    setResult,
    cleanup,
  };
}

export default function useSubStorage(
  pallet,
  storage,
  params = [],
  options = {}, // callback or api
) {
  const contextApi = useContextApi();
  const { callback, api = contextApi } = options;
  const chain = useChain();

  const normalizedParams = Array.isArray(params) ? params : [params];
  const key = `${chain}-${pallet}-${storage}-${JSON.stringify(
    normalizedParams,
  )}`;

  const { loading, result, setResult, cleanup } = useCachedResult(key);

  const subscribe = useDeepMemo(
    () => async () => {
      if (subs[key]) {
        subs[key].count++;
        return;
      }

      subs[key] = {
        unsub: null,
        count: 1,
      };

      const queryStorage = api?.query[pallet]?.[storage];
      if (!queryStorage) {
        setResult();
        return;
      }

      try {
        subs[key].unsub = await queryStorage(
          ...normalizedParams,
          (subscribeResult) => setResult(subscribeResult),
        );
      } catch (e) {
        setResult();
      }
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [api, pallet, storage, key, setResult, ...normalizedParams],
  );

  useEffect(() => {
    if (result && callback) {
      callback(result);
    }
  }, [result, callback]);

  useEffect(() => {
    if (!api || isNil(pallet) || isNil(storage)) {
      return;
    }

    subscribe();

    return () => {
      if (!subs[key]) {
        return;
      }
      subs[key].count--;
      if (subs[key].delayCleanup) {
        return;
      }
      subs[key].delayCleanup = setTimeout(() => {
        if (!subs[key] || !subs[key].delayCleanup) {
          return;
        }
        subs[key].delayCleanup = null;
        if (subs[key].count === 0) {
          subs[key].unsub?.();
          delete subs[key];

          cleanup();
        }
      }, 0);
    };
  }, [api, key, subscribe, pallet, storage, cleanup]);

  return { loading, result };
}
