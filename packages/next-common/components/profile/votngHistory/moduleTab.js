import React from "react";
import Tab from "next-common/components/tab";
import styled from "styled-components";

export const OpenGov = "OpenGov";
export const Democracy = "Democracy";

const Wrapper = styled.div`
  margin: -4px 0;
  .tabs-container {
    background-color: var(--neutral300);
    border-radius: 8px;
  }
  .tab-item {
    border-radius: 4px;
  }
`;

export default function ModuleTab({ moduleTabIndex, setModuleTabIndex }) {
  return (
    <Wrapper>
      <Tab
        small
        tabs={[
          {
            tabId: OpenGov,
            tabTitle: "OpenGov",
          },
          {
            tabId: Democracy,
            tabTitle: "Democracy",
          },
        ]}
        selectedTabId={moduleTabIndex}
        setSelectedTabId={setModuleTabIndex}
      />
    </Wrapper>
  );
}
