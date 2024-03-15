import Tabs from "next-common/components/tabs";
import { useState } from "react";
import ReferendaDelegateeDetailPopupAnnouncement from "../../../referenda/detailPopup/tabsContent/announcement";
import ReferendaDelegateeDetailPopupRecentVotes from "../../../referenda/detailPopup/tabsContent/recentVotes";
import DemocracyDelegateeDetailPopupBeenDelegated from "./beenDelegated";

export default function DemocracyDelegateeDetailPopupTabsContent({ delegate }) {
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
      label: "Been Delegated",
      content: (
        <DemocracyDelegateeDetailPopupBeenDelegated delegate={delegate} />
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
