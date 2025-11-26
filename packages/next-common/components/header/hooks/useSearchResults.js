import { useState, useMemo, useRef, useCallback } from "react";
import { backendApi } from "next-common/services/nextApi";
import { markdownToText } from "next-common/components/header/search/utils";
import useSearchIdentities from "next-common/components/header/hooks/useSearchIdentities";
import useSearchFellowshipMembers from "next-common/components/header/hooks/useSearchFellowshipMembers";
import {
  getChildBountyDisplayIndex,
  getChildBountyIndex,
} from "next-common/utils/viewfuncs/treasury/childBounty";
import { isEmpty } from "lodash-es";

export const ItemType = {
  CATEGORY: "category",
  ITEM: "item",
};

const formatItems = (
  proposalType,
  items,
  indexKeyOrGetIndexFn,
  displayIndexKeyOrGetIndexFn,
) => {
  if (!items || (items || []).length <= 0) {
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
      const displayIndex =
        typeof displayIndexKeyOrGetIndexFn === "string"
          ? item[displayIndexKeyOrGetIndexFn]
          : displayIndexKeyOrGetIndexFn?.(item);
      return {
        index: index ?? 0,
        displayIndex: displayIndex ?? 0,
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
};

const formatSearchResult = (proposalType, value) => {
  if (!value?.length) {
    return [];
  }
  return [
    {
      proposalType,
      type: ItemType.CATEGORY,
    },
    ...(value || []).map((item) => ({
      ...item,
      proposalType,
      type: ItemType.ITEM,
    })),
  ];
};

function useSearchResults() {
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef(null);
  const lastSearchValueRef = useRef("");
  const [fetchIdentities] = useSearchIdentities();

  const { search: searchFellowshipMembers } = useSearchFellowshipMembers();

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
      "search",
      {
        text: searchValue,
      },
      { signal },
    );
  }, []);

  const requestCallback = useCallback(
    (result, signal, searchValue) => {
      if (!signal.aborted && lastSearchValueRef.current === searchValue) {
        if (!isEmpty(formatResults(result))) {
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
          searchFellowshipMembers(searchValue).then((fellowshipMembers) =>
            requestCallback(
              { fellowshipMembers: fellowshipMembers || [] },
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
    [
      baseSearchDataRequest,
      combineIdentitiesRequest,
      searchFellowshipMembers,
      requestCallback,
    ],
  );

  const clearResults = useCallback(() => {
    setResults(null);
    lastSearchValueRef.current = "";

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, [abortControllerRef, lastSearchValueRef]);

  const totalList = useMemo(() => formatResults(results), [results]);

  return {
    totalList,
    fetch,
    isLoading,
    setResults,
    clearResults,
  };
}

export default useSearchResults;

function formatResults(results) {
  if (!results) return null;

  const priorityKeys = ["fellowshipMembers"];
  const allEntries = Object.entries(results);
  const priorityEntries = priorityKeys
    .map((key) => [key, results[key]])
    .filter(([, value]) => value !== undefined);

  const otherEntries = allEntries.filter(
    ([key]) => !priorityKeys.includes(key),
  );
  const orderedEntries = [...priorityEntries, ...otherEntries];

  return orderedEntries.flatMap(([key, value]) => {
    switch (key) {
      case "openGovReferenda":
        return formatItems("Referenda", value, "referendumIndex");
      case "democracyReferenda":
        return formatItems("DemocracyReferenda", value, "referendumIndex");
      case "bounties":
        return formatItems("Bounties", value, "bountyIndex");
      case "childBounties": {
        return formatItems(
          "ChildBounties",
          value,
          getChildBountyIndex,
          getChildBountyDisplayIndex,
        );
      }
      case "treasuryProposals":
        return formatItems("TreasuryProposals", value, "proposalIndex");
      case "treasurySpends":
        return formatItems("TreasurySpends", value, "index");
      case "fellowshipReferenda":
        return formatItems("FellowshipReferenda", value, "referendumIndex");
      case "fellowshipTreasurySpends":
        return formatItems("FellowshipTreasurySpends", value, "index");
      case "identities":
        return formatSearchResult("Identities", value);
      case "fellowshipMembers":
        return formatSearchResult("FellowshipMembers", value);
      default:
        return [];
    }
  });
}
