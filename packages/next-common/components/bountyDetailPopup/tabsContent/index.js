import Tabs from "next-common/components/tabs";
import { useState } from "react";
import React from "react";
import ChildBountyList from "./childBountyList";
import { isNil } from "lodash-es";

function BountyDetailPopupTabs({ childBounties, bountyIndex }) {
  const tabs = [
    {
      value: "childBounties",
      label: "Child Bounties",
      labelExtra: (
        <span className="text14Medium text-textTertiary ml-1 flex">
          {childBounties?.total ?? 0}
        </span>
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
  if (isNil(childBounties) || isNil(bountyIndex)) return null;

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
