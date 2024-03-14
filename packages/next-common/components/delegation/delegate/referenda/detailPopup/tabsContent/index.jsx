import Tabs from "next-common/components/tabs";
import { useState } from "react";
import ReferendaDelegateeDetailPopupBeenDelegated from "./beenDelegated";

export default function ReferendaDelegateeDetailPopupTabsContent({ delegate }) {
  const tabs = [
    {
      label: "Been Delegated",
      content: (
        <ReferendaDelegateeDetailPopupBeenDelegated delegate={delegate} />
      ),
    },
  ];

  const [activeTabLabel, setActiveTabLabel] = useState(tabs[0].label);

  return (
    <Tabs
      tabs={tabs}
      activeTabLabel={activeTabLabel}
      onTabClick={(tab) => {
        setActiveTabLabel(tab.label);
      }}
    />
  );
}
