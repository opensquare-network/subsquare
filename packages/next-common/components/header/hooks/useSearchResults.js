import { useState, useMemo, useRef, useCallback } from "react";
import { backendApi } from "next-common/services/nextApi";
import useRefCallback from "next-common/hooks/useRefCallback";
import { markdownToText } from "next-common/components/header/search/utils";
import useSearchIdentities from "next-common/components/header/hooks/useSearchIdentities";

export const ItemType = {
  CATEGORY: "category",
  ITEM: "item",
};

function useSearchResults() {
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef(null);
  const lastSearchValueRef = useRef("");
  const [fetchIdentities, isIdentitiesLoading] = useSearchIdentities();

  const combineIdentitiesRequest = useCallback(
    async (searchValue) => {
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
      "search",
      {
        text: searchValue,
      },
      { signal },
    );
  }, []);

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

      const [{ value: apiResult }, { value: identitiesResult }] =
        await Promise.allSettled([
          baseSearchDataRequest(searchValue, signal),
          combineIdentitiesRequest(searchValue),
        ]);

      const endIdentities = (identitiesResult || []).map((item, index) => ({
        index,
        content: item?.account,
        title: item?.fullDisplay ?? "-",
      }));

      if (!signal.aborted) {
        setResults({
          ...apiResult?.result,
          identities: endIdentities,
        });
      }
    } finally {
      if (searchValue === lastSearchValueRef.current) {
        setIsLoading(false);
      }
    }
  });

  const clearResults = useRefCallback(() => {
    setResults(null);
    lastSearchValueRef.current = "";

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  });

  const formatItems = useRefCallback(
    (proposalType, items, indexKeyOrGetIndexFn) => {
      if ((items?.length || []) <= 0) {
        return [];
      }

      return [
        {
          index: null,
          title: proposalType,
          content: "-",
          proposalType,
          type: ItemType.CATEGORY,
        },
        ...items.map((item) => {
          const index =
            typeof indexKeyOrGetIndexFn === "string"
              ? item[indexKeyOrGetIndexFn]
              : indexKeyOrGetIndexFn(item);
          return {
            index: index ?? 0,
            title: item.title ?? "-",
            content: item.content
              ? item.content
              : item.contentSummary?.summary
              ? markdownToText(item.contentSummary.summary)
              : "-",
            proposalType,
            type: ItemType.ITEM,
          };
        }),
      ];
    },
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
        case "childBounties": {
          return formatItems("ChildBounties", value, (item) => {
            return `${item.parentBountyId}_${item.index}`;
          });
        }
        case "identities":
          return formatItems("Identities", value, "index");
        case "treasuryProposals":
          return formatItems("TreasuryProposals", value, "proposalIndex");
        case "treasurySpends":
          return formatItems("TreasurySpends", value, "index");
        default:
          return [];
      }
    });
  }, [formatItems, results]);

  return {
    totalList,
    fetch,
    isLoading: isLoading || isIdentitiesLoading,
    setResults,
    clearResults,
  };
}

export default useSearchResults;
