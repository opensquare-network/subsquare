import { useState, useMemo, useRef, useCallback } from "react";
import nextApi from "next-common/services/nextApi";
import useRefCallback from "next-common/hooks/useRefCallback";
import { markdownToText } from "next-common/components/header/search/utils";

export const ItemType = {
  CATEGORY: "category",
  ITEM: "item",
};

function useSearchResults() {
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
        setResults(result ?? {});
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

  const formatItems = useRefCallback((proposalType, items, getIndex) =>
    items?.length > 0
      ? [
          {
            index: null,
            title: proposalType,
            content: "-",
            proposalType,
            type: ItemType.CATEGORY,
          },
          ...items.map((item) => ({
            index: item[getIndex] ?? 0,
            title: item.title ?? "-",
            content: item.contentSummary?.summary
              ? markdownToText(item.contentSummary.summary)
              : "-",
            proposalType,
            type: ItemType.ITEM,
          })),
        ]
      : [],
  );

  const totalList = useMemo(() => {
    if (!results) return null;

    return Object.entries(results).flatMap(([key, value]) => {
      switch (key) {
        case "openGovReferenda":
          return formatItems("Referenda", value, "referendumIndex");
        case "democracyReferenda":
          return formatItems("DemocracyReferenda", value, "referendumIndex");
        case "bounties":
          return formatItems("Bounties", value, "bountyIndex");
        case "childBounties":
          return formatItems("ChildBounties", value, "index");
        default:
          return [];
      }
    });
  }, [formatItems, results]);

  return {
    totalList,
    fetch,
    isLoading,
    setResults,
    clearResults,
  };
}

export default useSearchResults;
