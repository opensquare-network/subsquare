// TODO: timeline compact mode

import { cloneElement, useState } from "react";
import Tabs from "../tabs";

export default function DetailMultiTabs({
  defaultActiveTabLabel = "",
  call,
  business,
  metadata,
  timeline,
}) {
  const [timelineCompact, setTimelineCompact] = useState(false);

  const tabs = [
    call && { label: "Call", content: call },
    business && { label: "Business", content: business },
    metadata && { label: "Metadata", content: metadata },
    timeline && {
      label: "Timeline",
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
