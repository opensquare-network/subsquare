import React from "react";
import Tab from "next-common/components/tab";
import TabTitle from "next-common/components/tabTitle";

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
      <TabTitle
        name="Direct"
        num={directCount || 0}
        active={tabIndex === "Direct"}
      />
    );
  }

  const nayTab = tabs.find((tab) => tab.tabId === "Nested");
  if (nayTab) {
    nayTab.tabTitle = (
      <TabTitle
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
