import React from "react";
import Tab from "next-common/components/tab";

export const Aye = "Aye";
export const Nay = "Nay";
export const Split = "Split";

export default function AyeNaySplitTab({ tabIndex, setTabIndex }) {
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
      tabId: Split,
      tabTitle: "Split",
    },
  ];

  return (
    <Tab tabs={tabs} selectedTabId={tabIndex} setSelectedTabId={setTabIndex} />
  );
}
