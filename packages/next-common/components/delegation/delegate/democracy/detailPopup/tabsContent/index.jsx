import Tabs from "next-common/components/tabs";
import { useState } from "react";
import ReferendaDelegateeDetailPopupAnnouncement from "../../../referenda/detailPopup/tabsContent/announcement";
import ReferendaDelegateeDetailPopupRecentVotes from "../../../referenda/detailPopup/tabsContent/recentVotes";
import DemocracyDelegateeDetailPopupBeenDelegated from "./beenDelegated";

export default function DemocracyDelegateeDetailPopupTabsContent({ delegate }) {
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
        <DemocracyDelegateeDetailPopupBeenDelegated delegate={delegate} />
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
