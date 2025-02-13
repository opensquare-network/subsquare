import { debounce, zip } from "lodash-es";
import { Deferred } from "next-common/utils/deferred";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { useAsync } from "react-use";
import { CacheProvider, useCache } from "./cache";

const BatchContext = createContext();

export default BatchContext;

export function BatchProvider({ batchExecFn, children }) {
  const [pending] = useState(new Map());

  const delayExec = useMemo(
    () =>
      debounce(() => {
        if (pending.size < 1) {
          return;
        }
        const keys = [...pending.keys()];
        batchExecFn(keys)
          .then((results) => {
            for (const [key, value] of zip(keys, results)) {
              pending.get(key)?.resolve(value);
              pending.delete(key);
            }
          })
          .catch(() => {});
      }, 0),
    [pending, batchExecFn],
  );

  const handleInBatch = useCallback(
    (key) => {
      if (!pending.has(key)) {
        pending.set(key, new Deferred());
        delayExec();
      }
      return pending.get(key).promise;
    },
    [pending, delayExec],
  );

  return (
    <BatchContext.Provider value={{ handleInBatch }}>
      {children}
    </BatchContext.Provider>
  );
}

function CachedBatchImpl({ children }) {
  const { getCacheItem, setCacheItem } = useCache();
  const { handleInBatch } = useContext(BatchContext);

  const handleInCache = useCallback(
    async (key) => {
      const cached = getCacheItem(key);
      if (cached) {
        return cached;
      }
      const result = await handleInBatch(key);
      setCacheItem(key, result);
      return result;
    },
    [handleInBatch, getCacheItem, setCacheItem],
  );

  return (
    <BatchContext.Provider value={{ handleInBatch: handleInCache }}>
      {children}
    </BatchContext.Provider>
  );
}

export function CachedBatchProvider({ batchExecFn, children }) {
  return (
    <CacheProvider>
      <BatchProvider batchExecFn={batchExecFn}>
        <CachedBatchImpl>{children}</CachedBatchImpl>
      </BatchProvider>
    </CacheProvider>
  );
}

export function useValueFromBatchResult(key) {
  const { handleInBatch } = useContext(BatchContext);
  return useAsync(() => handleInBatch(key), [handleInBatch, key]);
}
