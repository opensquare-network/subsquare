import React from "react";
import Tab from "next-common/components/tab";
import isMoonChain from "next-common/utils/isMoonChain";

export const Aye = "Aye";
export const Nay = "Nay";
export const Split = "Split";

export default function VoteTypeTab({ tabIndex, setTabIndex }) {
  const tabs = [
    {
      tabId: Aye,
      tabTitle: "Aye",
    },
    {
      tabId: Nay,
      tabTitle: "Nay",
    },
  ];

  if (!isMoonChain()) {
    tabs.push({
      tabId: Split,
      tabTitle: "Split",
    });
  }

  return (
    <Tab
      tabs={tabs}
      selectedTabId={tabIndex}
      setSelectedTabId={setTabIndex}
    />
  );
}
