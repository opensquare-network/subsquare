import Tabs from "next-common/components/tabs";
import { useState } from "react";
import React from "react";
import TabLabel from "./tabLabel";
import ChildBountyList from "./childBountyList";

function BountyDetailPopupTabs({ childBounties, bountyIndex }) {
  const tabs = [
    {
      value: "childBounties",
      label: (
        <TabLabel label="Child Bounties" count={childBounties?.total ?? 0} />
      ),
      content: (
        <ChildBountyList
          childBounties={childBounties}
          bountyIndex={bountyIndex}
          className="mt-2"
        />
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

export default React.memo(BountyDetailPopupTabs);
