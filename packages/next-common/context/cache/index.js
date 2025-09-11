import { createContext, useCallback, useContext, useRef } from "react";

const CacheContext = createContext();

export function CacheProvider({ children }) {
  const cacheRef = useRef({});
  return (
    <CacheContext.Provider value={cacheRef}>{children}</CacheContext.Provider>
  );
}

export function useCache() {
  const cacheRef = useContext(CacheContext);

  const getCacheItem = useCallback(
    (name) => cacheRef.current[name],
    [cacheRef],
  );

  const setCacheItem = useCallback(
    (name, value) => {
      cacheRef.current = { ...cacheRef.current, [name]: value };
    },
    [cacheRef],
  );

  return {
    getCacheItem,
    setCacheItem,
  };
}
