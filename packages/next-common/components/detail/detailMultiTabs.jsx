// TODO: timeline compact mode

import { cloneElement, useState } from "react";
import Tabs from "../tabs";
import { useTimelineData } from "next-common/context/post";

export default function DetailMultiTabs({
  defaultActiveTabLabel = "",
  call,
  childBounties,
  childBountiesCount,
  business,
  metadata,
  timeline,
}) {
  const [timelineCompact, setTimelineCompact] = useState(false);
  const timelineData = useTimelineData();

  const tabs = [
    call && { label: "Call", content: call },
    childBounties && {
      label: "Child Bounties",
      activeCount: childBountiesCount,
      content: childBounties,
    },
    business && { label: "Business", content: business },
    metadata && { label: "Metadata", content: metadata },
    timeline && {
      label: "Timeline",
      activeCount: timelineData?.length,
      content: cloneElement(timeline, {
        compact: timelineCompact,
      }),
    },
  ].filter(Boolean);

  const [activeTabLabel, setActiveTabLabel] = useState(
    defaultActiveTabLabel || tabs[0].label,
  );

  return (
    <Tabs
      activeTabLabel={activeTabLabel}
      onTabClick={(tab) => setActiveTabLabel(tab.label)}
      tabs={tabs}
      tabsListExtra={
        <>
          {activeTabLabel === "Timeline" && false && (
            <div>
              <span onClick={() => setTimelineCompact(false)}>normal</span>
              <span onClick={() => setTimelineCompact(true)}>compact</span>
            </div>
          )}
        </>
      }
    />
  );
}
