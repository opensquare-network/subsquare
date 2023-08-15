import React, { useContext } from "react";
import Tab from "next-common/components/tab";
import styled from "styled-components";

export const Referenda = "Referenda";
export const Democracy = "Democracy";

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
      min-width: 120px;
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

export function ModuleTab() {
  const { moduleTabIndex, setModuleTabIndex } = useContext(ModuleTabContext);
  return (
    <Wrapper>
      <Tab
        small
        tabs={[
          {
            tabId: Referenda,
            tabTitle: Referenda,
          },
          {
            tabId: Democracy,
            tabTitle: Democracy,
          },
        ]}
        selectedTabId={moduleTabIndex}
        setSelectedTabId={setModuleTabIndex}
      />
    </Wrapper>
  );
}
