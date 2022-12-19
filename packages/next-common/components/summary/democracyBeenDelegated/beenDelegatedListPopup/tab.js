import React from "react";
import styled from "styled-components";
import Tab from "next-common/components/tab";

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  span.num {
    color: ${(p) => (p.active ? p.theme.textSecondary : p.theme.textTertiary)};
  }
`;

function Title({ name, num, active }) {
  return (
    <TitleWrapper active={active}>
      <div>
        {name} <span className="num">({num})</span>
      </div>
    </TitleWrapper>
  );
}

export const tabs = [
  {
    tabId: "Direct",
    tabTitle: "Direct",
  },
  {
    tabId: "Nested",
    tabTitle: "Nested",
  },
];
export default function VotesTab({
  tabIndex,
  setTabIndex,
  directCount,
  nestedCount,
}) {
  const ayeTab = tabs.find((tab) => tab.tabId === "Direct");
  if (ayeTab) {
    ayeTab.tabTitle = (
      <Title
        name="Direct"
        num={directCount || 0}
        active={tabIndex === "Direct"}
      />
    );
  }

  const nayTab = tabs.find((tab) => tab.tabId === "Nested");
  if (nayTab) {
    nayTab.tabTitle = (
      <Title
        name="Nested"
        num={nestedCount || 0}
        active={tabIndex === "Nested"}
      />
    );
  }

  return (
    <Tab tabs={tabs} selectedTabId={tabIndex} setSelectedTabId={setTabIndex} />
  );
}
