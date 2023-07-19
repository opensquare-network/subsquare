import React from "react";
import Tab from "next-common/components/tab";

export const Aye = "Aye";
export const Nay = "Nay";
export const Abstain = "Abstain";

export default function SplitAbstainVoteTabs({ tabIndex, setTabIndex }) {
  const tabs = [
    {
      tabId: Aye,
      tabTitle: "Aye",
    },
    {
      tabId: Nay,
      tabTitle: "Nay",
    },
    {
      tabId: Abstain,
      tabTitle: "Abstain",
    },
  ];

  return (
    <Tab tabs={tabs} selectedTabId={tabIndex} setSelectedTabId={setTabIndex} />
  );
}
