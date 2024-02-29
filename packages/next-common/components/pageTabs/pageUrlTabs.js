import React from "react";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import TabHeaders from "./tabHeaders";
import styled, { css } from "styled-components";
import { useRouter } from "next/router";

const Wrapper = styled.div``;

const ListWrapper = styled.div`
  margin: 16px 0;
`;

const TabTitle = styled(TitleContainer)`
  padding: 0;
  ${(p) =>
    p.active
      ? css`
          color: var(--textPrimary);
        `
      : css`
          color: var(--textTertiary);
        `}
`;

export default function PageUrlTabs({ tabs }) {
  const router = useRouter();
  const url = router.asPath.split("?")[0];
  const activeTab = tabs.find((item) => item.url === url);
  const tabHeaders = (tabs || []).map((tab) => ({
    value: tab.name,
    content: (
      <TabTitle active={activeTab?.name === tab.name}>{tab.name}</TabTitle>
    ),
    extra: tab.extra,
  }));

  let list = null;
  for (const tab of tabs) {
    if (activeTab?.name === tab.name) {
      list = tab.content;
      break;
    }
  }

  return (
    <Wrapper>
      <TabHeaders
        tabs={tabHeaders}
        activeTab={activeTab?.name}
        setActiveTab={(tabName) => {
          const tab = tabs.find((item) => item.name === tabName);
          router.push(
            {
              pathname: tab.url,
            },
            undefined,
            { shallow: true },
          );
        }}
      />
      <ListWrapper>{list}</ListWrapper>
    </Wrapper>
  );
}
