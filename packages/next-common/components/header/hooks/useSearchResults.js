import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { backendApi } from "next-common/services/nextApi";
import { markdownToText } from "next-common/components/header/search/utils";
import useSearchIdentities from "next-common/components/header/hooks/useSearchIdentities";
import {
  getChildBountyDisplayIndex,
  getChildBountyIndex,
} from "next-common/utils/viewfuncs/treasury/childBounty";
import { getIdentityDisplay } from "next-common/utils/identity";
import { fetchIdentity } from "next-common/services/identity";
import { useContextApi } from "next-common/context/api";
import { useAsync } from "react-use";
import { useChainSettings } from "next-common/context/chain";
import { Deferred } from "next-common/utils/deferred";

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

function useFellowshipMembers() {
  const api = useContextApi();
  return useAsync(async () => {
    if (!api) {
      return null;
    }

    try {
      const fellowshipMembers =
        await api?.query.fellowshipCollective.members.entries();
      return fellowshipMembers.map(
        ([
          {
            args: [account],
          },
          info,
        ]) => ({
          address: account.toString(),
          rank: info.unwrap()?.rank.toNumber(),
        }),
      );
    } catch (e) {
      return null;
    }
  }, [api]);
}

function useFellowshipMembersWithIdentity() {
  const { identity: identityChain } = useChainSettings();
  const { value: fellowshipMembers, loading } = useFellowshipMembers();
  return useAsync(async () => {
    if (loading) {
      return null;
    }
    if (!fellowshipMembers) {
      return null;
    }
    return await Promise.all(
      fellowshipMembers.map(async (member) => {
        const identity = await fetchIdentity(identityChain, member.address);
        const name = getIdentityDisplay(identity);
        return {
          ...member,
          name,
        };
      }),
    );
  }, [identityChain, fellowshipMembers, loading]);
}

function useSearchFellowshipMembers() {
  const [isLoading, setIsLoading] = useState(false);
  const { value: fellowshipMembers, loading: isFellowshipMembersLoading } =
    useFellowshipMembersWithIdentity();

  const [dataDeferred] = useState(new Deferred());

  useEffect(() => {
    if (isFellowshipMembersLoading || !fellowshipMembers) {
      return;
    }
    dataDeferred.resolve(fellowshipMembers);
  }, [fellowshipMembers, isFellowshipMembersLoading, dataDeferred]);

  const search = useCallback(
    async (searchValue) => {
      setIsLoading(true);
      try {
        const fellowshipMembers = await dataDeferred.promise;
        return searchFromMembers(fellowshipMembers, searchValue);
      } finally {
        setIsLoading(false);
      }
    },
    [dataDeferred],
  );

  return {
    search,
    isLoading,
  };
}

function searchFromMembers(members, text) {
  if (!members || !text || text.length < 3) {
    return [];
  }

  // filter members where contains text in address or name
  return members.filter(
    (member) =>
      member.address.toLowerCase().includes(text.toLowerCase()) ||
      (member.name ?? "").toLowerCase().includes(text.toLowerCase()),
  );
}

function useSearchResults() {
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef(null);
  const lastSearchValueRef = useRef("");
  const [fetchIdentities, isIdentitiesLoading] = useSearchIdentities();

  const {
    search: searchFellowshipMembers,
    isLoading: isFellowshipMembersLoading,
  } = useSearchFellowshipMembers();

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

  const fetch = useCallback(
    async (searchValue) => {
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

        const [
          { value: apiResult },
          { value: identitiesResult },
          { value: fellowshipMembers },
        ] = await Promise.allSettled([
          baseSearchDataRequest(searchValue, signal),
          combineIdentitiesRequest(searchValue),
          searchFellowshipMembers(searchValue),
        ]);

        if (!signal.aborted) {
          setResults({
            ...apiResult?.result,
            identities: identitiesResult || [],
            fellowshipMembers: fellowshipMembers || [],
          });
        }
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
      results,
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
  }, [results]);

  return {
    totalList,
    fetch,
    isLoading: isLoading || isIdentitiesLoading || isFellowshipMembersLoading,
    setResults,
    clearResults,
  };
}

export default useSearchResults;
