import React from "react";
import Tab from "next-common/components/tab";
import TabTitle from "next-common/components/tabTitle";
import AyeIcon from "next-common/assets/imgs/icons/aye.svg";
import NayIcon from "next-common/assets/imgs/icons/nay.svg";
import AbstainIcon from "next-common/assets/imgs/icons/abstain.svg";

export const Aye = "Aye";
export const Nay = "Nay";
export const Abstain = "Abstain";

export default function SplitAbstainVoteTabs({ tabIndex, setTabIndex }) {
  const tabs = [
    {
      tabId: Aye,
      tabTitle: (
        <TabTitle name="Aye" icon={<AyeIcon />} active={tabIndex === Aye} />
      ),
    },
    {
      tabId: Nay,
      tabTitle: (
        <TabTitle name="Nay" icon={<NayIcon />} active={tabIndex === Nay} />
      ),
    },
    {
      tabId: Abstain,
      tabTitle: (
        <TabTitle
          name="Abstain"
          icon={<AbstainIcon />}
          active={tabIndex === Abstain}
        />
      ),
    },
  ];

  return (
    <Tab tabs={tabs} selectedTabId={tabIndex} setSelectedTabId={setTabIndex} />
  );
}
