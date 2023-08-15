import React from "react";
import Tab from "next-common/components/tab";
import TabTitle from "next-common/components/tabTitle";
import AyeIcon from "next-common/assets/imgs/icons/aye.svg";
import NayIcon from "next-common/assets/imgs/icons/nay.svg";

export const Aye = "Aye";
export const Nay = "Nay";

export default function StandardVoteTabs({
  tabIndex,
  setTabIndex,
  isAye = true,
}) {
  let tabs = [
    {
      tabId: Aye,
      tabTitle: (
        <TabTitle name="Aye" icon={<AyeIcon />} active={tabIndex === Aye} />
      ),
    },
  ];

  if (!isAye) {
    tabs = [
      {
        tabId: Nay,
        tabTitle: (
          <TabTitle name="Nay" icon={<NayIcon />} active={tabIndex === Nay} />
        ),
      },
    ];
  }

  return (
    <Tab tabs={tabs} selectedTabId={tabIndex} setSelectedTabId={setTabIndex} />
  );
}
