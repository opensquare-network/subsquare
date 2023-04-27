import React from "react";
import noop from "lodash.noop";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  gap: 24px;
`;

const TabWrapper = styled.div`
  cursor: pointer;
`;

export default function TabHeaders({ tabs = [], setActiveTab = noop }) {
  return (
    <Wrapper>
      {tabs.map((tab, index) => (
        <TabWrapper key={index} onClick={() => setActiveTab(tab.value)}>
          {tab.content}
        </TabWrapper>
      ))}
    </Wrapper>
  );
}
