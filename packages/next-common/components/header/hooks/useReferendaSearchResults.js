import { useState, useMemo, useRef, useCallback } from "react";
import nextApi from "next-common/services/nextApi";
import useRefCallback from "next-common/hooks/useRefCallback";
import { markdownToText } from "next-common/components/header/search/utils";

function useReferendaSearchResults() {
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef(null);
  const lastSearchValueRef = useRef("");

  const fetch = useRefCallback(async (searchValue) => {
    if (searchValue === lastSearchValueRef.current && results !== null) {
      return;
    }

    try {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal; //avoid race and data leakage

      setIsLoading(true);
      lastSearchValueRef.current = searchValue;

      const { result } = await nextApi.fetch(
        "search",
        {
          text: searchValue,
        },
        { signal },
      );

      if (!signal.aborted) {
        setResults(result?.openGovReferenda || []);
      }
    } finally {
      if (searchValue === lastSearchValueRef.current) {
        setIsLoading(false);
      }
    }
  });

  const clearResults = useCallback(() => {
    setResults(null);
    lastSearchValueRef.current = "";

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  const referenda = useMemo(() => {
    return (
      results?.map((item) => ({
        index: item?.referendumIndex ?? 0,
        title: item?.title ?? "-",
        content: item?.contentSummary?.summary
          ? markdownToText(item?.contentSummary?.summary)
          : "-",
      })) ?? null
    );
  }, [results]);

  return {
    referenda,
    fetch,
    isLoading,
    setReferenda: setResults,
    clearResults,
  };
}

export default useReferendaSearchResults;
