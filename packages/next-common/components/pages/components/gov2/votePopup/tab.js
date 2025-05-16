import React from "react";
import Tab from "next-common/components/tab";
import Tooltip from "next-common/components/tooltip";

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
          tabTitle: (
            <Tooltip
              content="Apply your voting power to Aye with a 0.1-6x multiplier"
              contentClassName="max-w-[240px]"
            >
              Aye
            </Tooltip>
          ),
        },
        {
          tabId: Nay,
          tabTitle: (
            <Tooltip
              content="Apply your voting power to Nay with a 0.1-6x multiplier"
              contentClassName="max-w-[240px]"
            >
              Nay
            </Tooltip>
          ),
        },
        {
          tabId: Split,
          tabTitle: (
            <Tooltip
              content="Split your voting power between Aye and Nay with a 0.1x multiplier"
              contentClassName="max-w-[240px]"
            >
              Split
            </Tooltip>
          ),
        },
        {
          tabId: SplitAbstain,
          tabTitle: (
            <Tooltip
              content="Split your voting power among Aye, Nay and Abstain with a 0.1x multiplier"
              contentClassName="max-w-[240px]"
            >
              Abstain
            </Tooltip>
          ),
        },
      ]}
      selectedTabId={tabIndex}
      setSelectedTabId={setTabIndex}
    />
  );
}
