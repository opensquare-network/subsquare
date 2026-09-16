import { useState, useMemo, useRef, useCallback } from "react";
import { backendApi } from "next-common/services/nextApi";
import useSearchIdentities from "next-common/components/header/hooks/useSearchIdentities";
import { formatFullTextResults } from "next-common/components/header/search/utils/fullTextSections";
import { isEmpty } from "lodash-es";

// The hook of the full text search dialog. It is the full text search twin of
// useSearchResults: the proposals, the comments, the projects and the wiki
// docs come from the full text search (meilisearch) API of the backend, the
// identities keep coming from the index based identities search.
function useFullTextSearchResults() {
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef(null);
  const lastSearchValueRef = useRef("");
  const [fetchIdentities] = useSearchIdentities();

  const combineIdentitiesRequest = useCallback(
    async (searchValue) => {
      if (!searchValue || searchValue.length < 3) {
        return [];
      }
      const { identities } = (await fetchIdentities(searchValue)) ?? {};
      if (!identities) return null;

      return (Object.entries(identities) ?? []).flatMap(([key, value]) => {
        if (key === "identities") {
          return value;
        } else {
          return [];
        }
      });
    },
    [fetchIdentities],
  );

  const baseSearchDataRequest = useCallback(async (searchValue, signal) => {
    return await backendApi.fetch(
      "search/full-text",
      {
        text: searchValue,
      },
      { signal },
    );
  }, []);

  const requestCallback = useCallback(
    (result, signal, searchValue) => {
      if (!signal.aborted && lastSearchValueRef.current === searchValue) {
        if (!isEmpty(formatFullTextResults(result))) {
          setIsLoading(false);
        }
        setResults((prev) => ({
          ...prev,
          ...result,
        }));
      }
    },
    [lastSearchValueRef],
  );

  const fetch = useCallback(
    async (searchValue) => {
      if (searchValue === lastSearchValueRef.current) {
        return;
      }

      try {
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }

        abortControllerRef.current = new AbortController();
        const signal = abortControllerRef.current.signal; //avoid race and data leakage

        setResults(null);
        setIsLoading(true);
        lastSearchValueRef.current = searchValue;

        const promises = [
          baseSearchDataRequest(searchValue, signal).then((apiResult) =>
            requestCallback(apiResult?.result || {}, signal, searchValue),
          ),
          combineIdentitiesRequest(searchValue).then((identitiesResult) =>
            requestCallback(
              { identities: identitiesResult || [] },
              signal,
              searchValue,
            ),
          ),
        ];

        await Promise.allSettled(promises);
      } finally {
        if (searchValue === lastSearchValueRef.current) {
          setIsLoading(false);
        }
      }
    },
    [baseSearchDataRequest, combineIdentitiesRequest, requestCallback],
  );

  const clearResults = useCallback(() => {
    setResults(null);
    lastSearchValueRef.current = "";

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, [abortControllerRef, lastSearchValueRef]);

  const totalList = useMemo(() => formatFullTextResults(results), [results]);

  return {
    totalList,
    fetch,
    isLoading,
    setResults,
    clearResults,
  };
}

export default useFullTextSearchResults;
