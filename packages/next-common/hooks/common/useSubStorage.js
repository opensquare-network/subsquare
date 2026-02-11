import { useContextApi } from "next-common/context/api";
import { useCallback, useEffect, useSyncExternalStore } from "react";
import useDeepMemo from "../useDeepMemo";
import { useChain } from "next-common/context/chain";
import { isNil } from "lodash-es";
import { subStorageRpc } from "./subStorageRpc";

const DEFAULT_STATE = { loading: true, result: undefined };

const cacheStore = {
  data: {},
  listeners: {},
  subscriptions: {},
  pendingSubscriptions: {},

  getState(key) {
    if (!this.data[key]) {
      this.data[key] = DEFAULT_STATE;
    }
    return this.data[key];
  },

  setState(key, value) {
    const prevState = this.data[key];

    const shouldUpdate =
      !prevState ||
      prevState === DEFAULT_STATE ||
      prevState.result !== value.result ||
      prevState.loading !== value.loading;

    if (shouldUpdate) {
      this.data[key] = value;
      if (this.listeners[key]) {
        this.listeners[key].forEach((listener) => listener());
      }
    }
  },

  subscribe(key, listener) {
    if (!this.listeners[key]) {
      this.listeners[key] = new Set();
    }
    this.listeners[key].add(listener);

    return () => {
      this.listeners[key]?.delete(listener);
      if (this.listeners[key]?.size === 0) {
        setTimeout(() => {
          if (this.listeners[key]?.size === 0) {
            delete this.listeners[key];
            delete this.data[key];
            this.unsubscribe(key);
          }
        }, 0);
      }
    };
  },

  setSubscription(key, unsub) {
    this.subscriptions[key] = unsub;
    delete this.pendingSubscriptions[key];
  },

  getSubscription(key) {
    return this.subscriptions[key];
  },

  isPendingSubscription(key) {
    return this.pendingSubscriptions[key];
  },

  setPendingSubscription(key, value) {
    if (value) {
      this.pendingSubscriptions[key] = true;
    } else {
      delete this.pendingSubscriptions[key];
    }
  },

  unsubscribe(key) {
    const unsub = this.getSubscription(key);
    if (unsub) {
      unsub();
      delete this.subscriptions[key];
    }
    delete this.pendingSubscriptions[key];
  },
};

function useCachedStore(key) {
  const state = useSyncExternalStore(
    useCallback((listener) => cacheStore.subscribe(key, listener), [key]),
    useCallback(() => cacheStore.getState(key), [key]),
    () => DEFAULT_STATE, // SSR fallback
  );

  const { loading = true, result = undefined } = state;

  const setResult = useCallback(
    (result) => {
      cacheStore.setState(key, { result, loading: false });
    },
    [key],
  );

  const getSubscription = useCallback(() => {
    return cacheStore.getSubscription(key);
  }, [key]);

  const setSubscription = useCallback(
    (unsub) => {
      cacheStore.setSubscription(key, unsub);
    },
    [key],
  );

  const isPendingSubscription = useCallback(() => {
    return cacheStore.isPendingSubscription(key);
  }, [key]);

  const setPendingSubscription = useCallback(
    (value) => {
      cacheStore.setPendingSubscription(key, value);
    },
    [key],
  );

  return {
    loading,
    result,
    setResult,
    getSubscription,
    setSubscription,
    isPendingSubscription,
    setPendingSubscription,
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

  const paramsKey = normalizedParams
    .map((p) => {
      if (p === null || p === undefined) return "null";
      if (typeof p === "object") {
        try {
          return JSON.stringify(p);
        } catch {
          return String(p);
        }
      }
      return String(p);
    })
    .join(",");

  const key = `${chain}-${pallet}-${storage}-${paramsKey}`;

  const {
    loading,
    result,
    setResult,
    getSubscription,
    setSubscription,
    isPendingSubscription,
    setPendingSubscription,
  } = useCachedStore(key);

  const subscribe = useDeepMemo(
    () => async () => {
      const queryStorage = api?.query[pallet]?.[storage];
      if (!queryStorage) {
        setResult();
        return;
      }

      if (getSubscription() || isPendingSubscription()) {
        return;
      }

      setPendingSubscription(true);

      try {
        const unsub = await subStorageRpc(
          api,
          queryStorage,
          normalizedParams,
          (subscribeResult) => setResult(subscribeResult),
        );
        setSubscription(unsub);
      } catch (e) {
        console.error("useSubStorage error:", e);
        // setResult();
        setPendingSubscription(false);
      }
    },
    [
      api,
      pallet,
      storage,
      setResult,
      getSubscription,
      setSubscription,
      isPendingSubscription,
      setPendingSubscription,
      ...normalizedParams,
    ],
  );

  useEffect(() => {
    if (callback && result !== undefined) {
      callback(result);
    }
  }, [result, callback]);

  useEffect(() => {
    if (!api || isNil(pallet) || isNil(storage)) {
      return;
    }

    subscribe();
  }, [api, pallet, storage, subscribe]);

  return { loading, result };
}
