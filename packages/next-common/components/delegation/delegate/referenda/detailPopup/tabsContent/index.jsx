import Tabs from "next-common/components/tabs";
import { useState } from "react";
import ReferendaDelegateeDetailPopupBeenDelegated from "./beenDelegated";
import ReferendaDelegateeDetailPopupRecentVotes from "./recentVotes";
import ReferendaDelegateeDetailPopupAnnouncement from "./announcement";

export default function ReferendaDelegateeDetailPopupTabsContent({ delegate }) {
  const tabs = [
    {
      label: "Announcement",
      content: (
        <ReferendaDelegateeDetailPopupAnnouncement delegate={delegate} />
      ),
    },
    {
      label: "Recent Votes",
      content: <ReferendaDelegateeDetailPopupRecentVotes delegate={delegate} />,
    },
    {
      label: "Received Delegations",
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
