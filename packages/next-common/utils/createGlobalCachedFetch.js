import { useCallback, useEffect } from "react";
import { createGlobalState } from "react-use";

export default function createGlobalCachedFetch() {
  const refs = {};
  const useCachedState = createGlobalState({});

  function useCachedResult(key) {
    const [cachedState, setCachedState] = useCachedState();
    const { loading = true, result = undefined } = cachedState[key] || {};

    const setResult = useCallback(
      (result) =>
        setCachedState((state) => ({
          ...state,
          [key]: { ...state[key], result, loading: false },
        })),
      [key, setCachedState],
    );

    const cleanup = useCallback(
      () =>
        setCachedState((state) =>
          Object.fromEntries(Object.entries(state).filter(([k]) => k !== key)),
        ),
      [key, setCachedState],
    );

    return {
      loading,
      result,
      setResult,
      cleanup,
    };
  }

  function useGlobalCachedFetch(fetchDataFunc, key) {
    const { loading, result, setResult, cleanup } = useCachedResult(key);

    const fetch = useCallback(async () => {
      const ref = refs[key];
      if (!ref) {
        return;
      }
      // Only one ongoing fetch at a time
      if (ref.fetching) {
        return;
      }
      ref.fetching = true;
      try {
        await fetchDataFunc(setResult);
      } finally {
        ref.fetching = false;
      }
    }, [key, setResult, fetchDataFunc]);

    // Manage references
    useEffect(() => {
      let ref = refs[key];
      if (!ref) {
        ref = refs[key] = { count: 1 };
      } else {
        ref.count++;
        if (ref.cleanupTimeout) {
          clearTimeout(ref.cleanupTimeout);
          ref.cleanupTimeout = undefined;
        }
      }

      return () => {
        const ref = refs[key];
        if (!ref) {
          return;
        }
        ref.count--;
        if (ref.count > 0) {
          return;
        }
        ref.cleanupTimeout = setTimeout(() => {
          delete refs[key];
          cleanup();
        }, 1000);
      };
    }, [key, cleanup]);

    useEffect(() => {
      if (result) {
        return;
      }
      fetch();
    }, [fetch, result]);

    return {
      loading,
      result,
      fetch,
    };
  }

  return { useGlobalCachedFetch };
}
