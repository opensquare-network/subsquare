import React from "react";
import Tab from "next-common/components/tab";

export const Aye = "Aye";
export const Nay = "Nay";

export default function AyeNayTab({ tabIndex, setTabIndex }) {
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

  return (
    <Tab
      tabs={tabs}
      selectedTabId={tabIndex}
      setSelectedTabId={setTabIndex}
    />
  );
}
