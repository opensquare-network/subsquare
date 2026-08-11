import { NeutralPanel } from "next-common/components/styled/containers/neutralPanel";
import Tabs from "next-common/components/tabs";
import { useState } from "react";
import { ProfileFellowshipCoreFeedsServerFirst } from "./feeds";
import ProfileFellowshipCoreRank from "./rank";

export default function ProfileFellowshipCore() {
  const tabs = [
    {
      label: "Feeds",
      value: "feeds",
      content: <ProfileFellowshipCoreFeedsServerFirst />,
    },
    {
      label: "Rank",
      value: "rank",
      content: <ProfileFellowshipCoreRank />,
    },
  ];

  const [activeTabValue, setActiveTabValue] = useState(tabs[0].value);

  return (
    <NeutralPanel className="p-6">
      <Tabs
        tabs={tabs}
        activeTabValue={activeTabValue}
        onTabClick={(tab) => {
          setActiveTabValue(tab.value);
        }}
      />
    </NeutralPanel>
  );
}
