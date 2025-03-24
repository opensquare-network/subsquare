import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import ProfileFellowshipCoreFeeds from "next-common/components/profile/fellowship/core/feeds";
import Tabs from "next-common/components/tabs";
import { useState } from "react";

export default function CoreActivities() {
  const tabs = [
    {
      label: "Feeds",
      value: "feeds",
      content: (
        <ProfileFellowshipCoreFeeds
          noDataText="No current activities"
          showUserInfo={false}
        />
      ),
    },
  ];

  const [activeTabValue, setActiveTabValue] = useState(tabs[0].value);

  return (
    <SecondaryCard>
      <Tabs
        tabs={tabs}
        activeTabValue={activeTabValue}
        onTabClick={(tab) => {
          setActiveTabValue(tab.value);
        }}
      />
    </SecondaryCard>
  );
}
