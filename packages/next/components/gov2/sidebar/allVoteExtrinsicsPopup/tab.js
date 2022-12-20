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

function Title({ name, icon = null, num, active }) {
  return (
    <TitleWrapper active={active}>
      {icon}
      <div>
        {name} <span className="num">({num})</span>
      </div>
    </TitleWrapper>
  );
}

export const tabs = [
  {
    tabId: "Aye",
    tabTitle: "Aye",
  },
  {
    tabId: "Nay",
    tabTitle: "Nay",
  },
  {
    tabId: "Abstain",
    tabTitle: "Abstain",
  },
];

export default function VotesTab({
  tabIndex,
  setTabIndex,
  ayesCount,
  naysCount,
  abstainCount,
}) {
  const ayeTab = tabs.find((tab) => tab.tabId === "Aye");
  if (ayeTab) {
    ayeTab.tabTitle = (
      <Title name="Ayes" num={ayesCount || 0} active={tabIndex === "Aye"} />
    );
  }

  const nayTab = tabs.find((tab) => tab.tabId === "Nay");
  if (nayTab) {
    nayTab.tabTitle = (
      <Title name="Nays" num={naysCount || 0} active={tabIndex === "Nay"} />
    );
  }

  const abstainTab = tabs.find((tab) => tab.tabId === "Abstain");
  if (abstainTab) {
    abstainTab.tabTitle = (
      <Title
        name="Abstains"
        num={abstainCount || 0}
        active={tabIndex === "Abstain"}
      />
    );
  }

  return (
    <Tab tabs={tabs} selectedTabId={tabIndex} setSelectedTabId={setTabIndex} />
  );
}
