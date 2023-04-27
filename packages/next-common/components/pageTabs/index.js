import React from "react";
import { useState } from "react";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import TabHeaders from "./tabHeaders";
import styled, { css } from "styled-components";

const Wrapper = styled.div``;

const ListWrapper = styled.div`
  margin: 16px 0;
`;

const TabTitle = styled(TitleContainer)`
  ${(p) =>
    p.active
      ? css`
          color: ${p.theme.textPrimary};
        `
      : css`
          color: ${p.theme.textTertiary};
        `}
`;

export default function PageTabs({ tabs }) {
  const [activeTab, setActiveTab] = useState(tabs?.[0]?.name);
  const tabHeaders = (tabs || []).map(tab => ({
    value: tab.name,
    content: (
      <TabTitle active={activeTab === tab.name}>{tab.name}</TabTitle>
    ),
  }));

  let list = null;
  for (const tab of tabs) {
    if (activeTab === tab.name) {
      list = tab.content;
      break;
    }
  }

  return (
    <Wrapper>
      <TabHeaders tabs={tabHeaders} setActiveTab={setActiveTab} />
      <ListWrapper>{list}</ListWrapper>
    </Wrapper>
  );
}
