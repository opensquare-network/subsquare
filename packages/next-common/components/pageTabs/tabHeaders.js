import React from "react";
import { noop } from "lodash-es";
import styled from "styled-components";
import FlexBetweenCenter from "../styled/flexBetweenCenter";

const Wrapper = styled.div`
  display: flex;
  gap: 24px;
`;

const TabWrapper = styled.div`
  cursor: pointer;
`;

export default function TabHeaders({
  tabs = [],
  activeTab,
  setActiveTab = noop,
}) {
  return (
    <FlexBetweenCenter className="flex-wrap max-sm:pr-[24px] max-sm:gap-[12px] max-sm:!items-start">
      <Wrapper>
        {tabs.map((tab, index) => (
          <TabWrapper key={index} onClick={() => setActiveTab(tab.value)}>
            {tab.content}
          </TabWrapper>
        ))}
      </Wrapper>
      {tabs.find((tab) => tab.value === activeTab)?.extra}
    </FlexBetweenCenter>
  );
}
