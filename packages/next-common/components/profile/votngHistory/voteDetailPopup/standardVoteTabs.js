import React from "react";
import Tab from "next-common/components/tab";

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
      tabTitle: "Aye",
    },
  ];

  if (!isAye) {
    tabs = [
      {
        tabId: Nay,
        tabTitle: "Nay",
      },
    ];
  }

  return (
    <Tab tabs={tabs} selectedTabId={tabIndex} setSelectedTabId={setTabIndex} />
  );
}
