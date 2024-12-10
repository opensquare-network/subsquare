import Tabs from "next-common/components/tabs";
import { useState } from "react";
import ReferendaDelegateeDetailPopupBeenDelegated from "./beenDelegated";
import ReferendaDelegateeDetailPopupRecentVotes from "./recentVotes";
import ReferendaDelegateeDetailPopupAnnouncement from "./announcement";

export default function ReferendaDelegateeDetailPopupTabsContent({ delegate }) {
  const tabs = [
    {
      value: "announcement",
      label: "Announcement",
      content: (
        <ReferendaDelegateeDetailPopupAnnouncement delegate={delegate} />
      ),
    },
    {
      value: "recent_votes",
      label: "Recent Votes",
      content: <ReferendaDelegateeDetailPopupRecentVotes delegate={delegate} />,
    },
    {
      value: "received_delegations",
      label: "Received Delegations",
      content: (
        <ReferendaDelegateeDetailPopupBeenDelegated delegate={delegate} />
      ),
    },
  ];

  const [activeTabValue, setActiveTabValue] = useState(tabs[0].value);

  return (
    <Tabs
      tabs={tabs}
      activeTabValue={activeTabValue}
      onTabClick={(tab) => {
        setActiveTabValue(tab.value);
      }}
    />
  );
}
