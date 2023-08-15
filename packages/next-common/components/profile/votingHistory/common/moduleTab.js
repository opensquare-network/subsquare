import React, { useContext } from "react";
import Tab from "next-common/components/tab";
import styled from "styled-components";

export const Referenda = "Referenda";
export const Democracy = "Democracy";
export const Fellowship = "Fellowship";

const Wrapper = styled.div`
  display: flex;
  flex-grow: 1;
  margin: -4px 0;
  justify-content: right;

  .tabs-container {
    background-color: var(--neutral300);
    border-radius: 8px;
  }
  .tab-item {
    border-radius: 4px;
    max-width: 124px;
  }
  @media screen and (min-width: 1024px) {
    max-width: 280px;
  }
  @media screen and (max-width: 1024px) {
    .tabs-container {
      margin: 0 24px;
      flex-grow: 1;
    }
    .tab-item {
      width: unset;
      max-width: 94px;
    }
  }
`;

export const ModuleTabContext = React.createContext();

export function ModuleTabProvider({ defaultTab, children }) {
  const [moduleTabIndex, setModuleTabIndex] = React.useState(defaultTab);
  return (
    <ModuleTabContext.Provider value={{ moduleTabIndex, setModuleTabIndex }}>
      {children}
    </ModuleTabContext.Provider>
  );
}

export function useModuleTab() {
  const { moduleTabIndex } = useContext(ModuleTabContext);
  return moduleTabIndex;
}

export function useIsReferenda() {
  const moduleTabIndex = useModuleTab();
  return moduleTabIndex === Referenda;
}

export function useIsFellowship() {
  const moduleTabIndex = useModuleTab();
  return moduleTabIndex === Fellowship;
}

export function useModuleName() {
  const moduleTabIndex = useModuleTab();
  if (moduleTabIndex === Referenda) {
    return "referenda";
  } else if (moduleTabIndex === Fellowship) {
    return "fellowship";
  } else if (moduleTabIndex === Democracy) {
    return "democracy";
  } else {
    throw new Error("Invalid module tab index");
  }
}

export function ModuleTab({ tabIds }) {
  const { moduleTabIndex, setModuleTabIndex } = useContext(ModuleTabContext);
  return (
    <Wrapper>
      <Tab
        small
        tabs={(tabIds || []).map((tabId) => ({
          tabId,
          tabTitle: tabId,
        }))}
        selectedTabId={moduleTabIndex}
        setSelectedTabId={setModuleTabIndex}
      />
    </Wrapper>
  );
}
