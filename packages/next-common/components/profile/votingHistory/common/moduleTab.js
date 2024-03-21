import React, { useCallback, useContext } from "react";
import Tab from "next-common/components/tab";
import styled from "styled-components";
import { useRouter } from "next/router";

export const Referenda = "Referenda";
export const Democracy = "Democracy";
export const Fellowship = "Fellowship";

const Wrapper = styled.div`
  display: flex;
  flex-grow: 1;
  margin: -4px 0;
  justify-content: right;
  @media screen and (max-width: 768px) {
    justify-content: center;
  }

  .tabs-container {
    background-color: var(--neutral300);
    border-radius: 8px;
  }
  .tab-item {
    border-radius: 4px;
  }
  @media screen and (min-width: 768px) {
    max-width: 280px;
    .tab-item {
      max-width: 124px;
    }
  }
  @media screen and (max-width: 768px) {
    .tabs-container {
      flex-grow: 1;
    }
  }
`;

export const ModuleTabContext = React.createContext();

export function ModuleTabProvider({
  availableTabs = [],
  defaultTab,
  children,
  queryName = "type",
  shallow = true,
}) {
  const router = useRouter();

  const qTab = availableTabs.find(
    (tab) =>
      tab.tabId.toLowerCase() === router.query?.[queryName]?.toLowerCase(),
  )?.tabId;
  const selectedTabId = qTab || defaultTab || availableTabs[0]?.tabId;

  const getTabUrl = useCallback(
    (tabId) => {
      const lowerTabId = tabId?.toLowerCase();

      const [urlPath, urlQuery] = router.asPath.split("?");
      const isFirstTab = availableTabs[0]?.tabId?.toLowerCase() === lowerTabId;
      const noAvailableTabs = availableTabs.length === 0;

      const urlSearch = new URLSearchParams(urlQuery);
      if (
        isFirstTab &&
        urlSearch.has(queryName) &&
        urlSearch.get(queryName)?.toLowerCase() !== lowerTabId
      ) {
        urlSearch.delete(queryName);
      } else if (
        !isFirstTab &&
        !noAvailableTabs &&
        urlSearch.get(queryName)?.toLowerCase() !== lowerTabId
      ) {
        urlSearch.set(queryName, lowerTabId);
      }

      const newQuery = urlSearch.size > 0 ? `?${urlSearch.toString()}` : "";

      return urlPath + newQuery;
    },
    [router, queryName, availableTabs],
  );

  const navigateToTab = useCallback(
    (tabId) => {
      const newUrl = getTabUrl(tabId);
      if (newUrl !== router.asPath) {
        router.push(newUrl, undefined, {
          shallow,
        });
      }
    },
    [router, getTabUrl, shallow],
  );

  return (
    <ModuleTabContext.Provider
      value={{
        availableTabs,
        selectedTabId,
        setSelectedTabId: navigateToTab,
      }}
    >
      {children}
    </ModuleTabContext.Provider>
  );
}

export function useModuleTab() {
  const { selectedTabId } = useContext(ModuleTabContext);
  return selectedTabId;
}

export function useIsReferenda() {
  const selectedTabId = useModuleTab();
  return selectedTabId === Referenda;
}

export function useIsFellowship() {
  const selectedTabId = useModuleTab();
  return selectedTabId === Fellowship;
}

export function useModuleName() {
  const selectedTabId = useModuleTab();
  if (selectedTabId === Referenda) {
    return "referenda";
  } else if (selectedTabId === Fellowship) {
    return "fellowship";
  } else if (selectedTabId === Democracy) {
    return "democracy";
  } else {
    throw new Error("Invalid module tab index");
  }
}

export function useTitleLink(referendumIndex) {
  const selectedTabId = useModuleTab();
  if (selectedTabId === Referenda) {
    return `/referenda/${referendumIndex}`;
  } else if (selectedTabId === Fellowship) {
    return `/fellowship/referenda/${referendumIndex}`;
  } else if (selectedTabId === Democracy) {
    return `/democracy/referenda/${referendumIndex}`;
  } else {
    throw new Error(`Unknown user votes tab: ${selectedTabId}`);
  }
}

export function useAvailableModuleTabs() {
  const { availableTabs } = useContext(ModuleTabContext);
  return availableTabs;
}

export function ModuleTab() {
  const { availableTabs, selectedTabId, setSelectedTabId } =
    useContext(ModuleTabContext);

  if (!(availableTabs?.length > 1)) {
    return null;
  }

  return (
    <Wrapper>
      <Tab
        small
        tabs={availableTabs}
        selectedTabId={selectedTabId}
        setSelectedTabId={setSelectedTabId}
      />
    </Wrapper>
  );
}
