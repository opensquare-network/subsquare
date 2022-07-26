import React from "react";
import Tab from "../tab";

export const SubSquare = "SubSquare";
export const Polkassembly = "Polkassembly";

export default function SourceTabs({ small = true, tabIndex, setTabIndex }) {
  return (
    <Tab
      small={small}
      tabs={[
        {
          tabId: SubSquare,
          tabTitle: "SubSquare",
        },
        {
          tabId: Polkassembly,
          tabTitle: "Polkassembly",
        },
      ]}
      selectedTabId={tabIndex}
      setSelectedTabId={setTabIndex}
    />
  );
}
