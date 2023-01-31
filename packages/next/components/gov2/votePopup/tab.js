import React from "react";
import Tab from "next-common/components/tab";

export const Aye = "Aye";
export const Nay = "Nay";
export const Split = "Split";
export const SplitAbstain = "SplitAbstain";

export default function VoteTypeTab({ tabIndex, setTabIndex }) {
  return (
    <Tab
      tabs={[
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
        {
          tabId: SplitAbstain,
          tabTitle: "Abstain",
        },
      ]}
      selectedTabId={tabIndex}
      setSelectedTabId={setTabIndex}
    />
  );
}
