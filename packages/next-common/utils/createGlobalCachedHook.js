import { useCallback, useEffect } from "react";
import { createGlobalState } from "react-use";

export default function createGlobalCachedHook() {
  const useCachedState = createGlobalState({});

  function useCachedResult(key) {
    const [cachedState, setCachedState] = useCachedState();
    const {
      loading = true,
      fetching = false,
      result = undefined,
    } = cachedState[key] || {};

    const setFetching = useCallback(
      (fetching) =>
        setCachedState((val) => ({
          ...val,
          [key]: { ...val[key], fetching },
        })),
      [key, setCachedState],
    );

    const setResult = useCallback(
      (result) =>
        setCachedState((val) => ({
          ...val,
          [key]: { result, fetching: false, loading: false },
        })),
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
      fetching,
      result,
      setResult,
      setFetching,
      cleanup,
    };
  }

  function useGlobalCachedHook(fetchDataFunc, key) {
    const { loading, fetching, result, setResult, setFetching } =
      useCachedResult(key);

    const fetch = useCallback(async () => {
      if (fetching) {
        return;
      }

      setFetching(true);
      try {
        const result = await fetchDataFunc({ setResult, setFetching });
        setResult(result);
      } finally {
        setFetching(false);
      }
    }, [fetching, setFetching, setResult, fetchDataFunc]);

    useEffect(() => {
      if (!result) {
        fetch();
      }
    }, [result, fetch]);

    return {
      loading,
      fetching,
      result,
    };
  }

  return useGlobalCachedHook;
}
