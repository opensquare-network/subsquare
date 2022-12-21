import React from "react";
import Tab from "next-common/components/tab";
import TabTitle from "next-common/components/tabTitle";

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
      <TabTitle name="Ayes" num={ayesCount || 0} active={tabIndex === "Aye"} />
    );
  }

  const nayTab = tabs.find((tab) => tab.tabId === "Nay");
  if (nayTab) {
    nayTab.tabTitle = (
      <TabTitle name="Nays" num={naysCount || 0} active={tabIndex === "Nay"} />
    );
  }

  const abstainTab = tabs.find((tab) => tab.tabId === "Abstain");
  if (abstainTab) {
    abstainTab.tabTitle = (
      <TabTitle
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
