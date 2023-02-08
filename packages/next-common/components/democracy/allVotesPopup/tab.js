import React from "react";
import Tab from "../../tab";
import TabTitle from "next-common/components/tabTitle";
import AyeIcon from "public/imgs/icons/aye.svg";
import NayIcon from "public/imgs/icons/nay.svg";

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
      <TabTitle
        name="Aye"
        icon={<AyeIcon />}
        num={ayesCount || 0}
        active={tabIndex === "Aye"}
      />
    );
  }

  const nayTab = tabs.find((tab) => tab.tabId === "Nay");
  if (nayTab) {
    nayTab.tabTitle = (
      <TabTitle
        name="Nay"
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
