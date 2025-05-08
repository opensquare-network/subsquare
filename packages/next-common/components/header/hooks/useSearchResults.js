import { useState, useMemo, useRef } from "react";
import nextApi from "next-common/services/nextApi";
import useRefCallback from "next-common/hooks/useRefCallback";
import { markdownToText } from "next-common/components/header/search/utils";
import useSearchIdentities from "next-common/components/header/hooks/useSearchIdentities";
import fetchBatchIdentities from "next-common/components/data/common/fetchBatchIdentities";
import { useChainSettings } from "next-common/context/chain";
import { trackPromises } from "next-common/components/header/search/utils";

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
  const { identity: identityChain } = useChainSettings();

  const combineIdentitiesRequest = useRefCallback(
    async (searchValue, identityChain) => {
      try {
        const { identities } = (await fetchIdentities(searchValue)) ?? {};
        if (!identities) return null;

        const accounts = (Object.entries(identities) ?? []).flatMap(
          ([key, value]) => {
            if (key === "identities") {
              return value.map((item) => item.account);
            } else {
              return [];
            }
          },
        );

        return await fetchBatchIdentities(identityChain, accounts);
      } catch (e) {
        return Promise.reject(e);
      }
    },
  );

  const baseSearchDataRequest = useRefCallback(async (searchValue, signal) => {
    try {
      return await nextApi.fetch(
        "search",
        {
          text: searchValue,
        },
        { signal },
      );
    } catch (e) {
      return Promise.reject(e);
    }
  });

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

      const trackResults = await trackPromises([
        baseSearchDataRequest(searchValue, signal),
        combineIdentitiesRequest(searchValue, identityChain),
      ]);

      const [apiResult, identitiesResult] = trackResults.reduce(
        (acc, item) => {
          if (item?.data?.result) {
            acc[0] = item.data.result;
          } else if (item?.data) {
            acc[1] = item.data;
          }
          return acc;
        },
        [{}, {}],
      );

      const endIdentities = Object.entries(identitiesResult || {}).map(
        ([key, value], index) => ({
          index,
          content: key,
          title: value,
        }),
      );

      if (!signal.aborted) {
        setResults(
          {
            ...apiResult,
            identities: endIdentities,
          } ?? {},
        );
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
            content: item.content
              ? item.content
              : item.contentSummary?.summary
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
        case "identities":
          return formatItems("Identities", value, "index");
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
