import React from "react";
import styled from "styled-components";
import Tab from "../../tab";
import AyeIcon from "public/imgs/icons/aye.svg";
import NayIcon from "public/imgs/icons/nay.svg";

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  span.num {
    color: ${(p) => (p.active ? p.theme.textSecondary : p.theme.textTertiary)};
  }
`;

function Title({ name, icon, num, active }) {
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
];
export default function VotesTab({
  tabIndex,
  setTabIndex,
  ayesCount,
  naysCount,
}) {
  const ayeTab = tabs.find((tab) => tab.tabId === "Aye");
  if (ayeTab) {
    ayeTab.tabTitle = (
      <Title
        name="Ayes"
        icon={<AyeIcon />}
        num={ayesCount || 0}
        active={tabIndex === "Aye"}
      />
    );
  }

  const nayTab = tabs.find((tab) => tab.tabId === "Nay");
  if (nayTab) {
    nayTab.tabTitle = (
      <Title
        name="Nays"
        icon={<NayIcon />}
        num={naysCount || 0}
        active={tabIndex === "Nay"}
      />
    );
  }

  return (
    <Tab tabs={tabs} selectedTabId={tabIndex} setSelectedTabId={setTabIndex} />
  );
}
