import { cloneElement, useState } from "react";
import Tabs from "../../tabs";
import { useTimelineData } from "next-common/context/post";
import Tab from "../../tab";
import { TimelineCompact, TimelineNormal } from "@osn/icons/subsquare";
import { ThemedTag } from "next-common/components/tags/state/styled";
import VotesBubbleViewTabs from "./votesBubbleViewTabs";

export default function DetailMultiTabs({
  defaultActiveTabLabel = "",
  call,
  childBounties,
  childBountiesCount,
  business,
  metadata,
  timeline,
  timelineCount,
  votesBubble,
}) {
  const timelineData = useTimelineData();
  const [timelineModeTabId, setTimelineModeTabId] = useState("normal");
  const timelineCompact = timelineModeTabId === "compact";

  const tabs = [
    business && { label: "Business", content: business },
    call && { label: "Call", content: call },
    childBounties && {
      label: "Child Bounties",
      activeCount: childBountiesCount,
      content: childBounties,
    },
    metadata && { label: "Metadata", content: metadata },
    timeline && {
      label: "Timeline",
      activeCount: timelineCount || timelineData?.length,
      content: (
        <div>
          <div className="sm:hidden">
            <TimelineModeTabs
              timelineModeTabId={timelineModeTabId}
              setTimelineModeTabId={setTimelineModeTabId}
            />
          </div>

          {cloneElement(timeline, {
            compact: timelineCompact,
          })}
        </div>
      ),
    },
    votesBubble && {
      label: "Votes Bubble",
      labelExtra: (
        <ThemedTag className="!rounded-full max-sm:!hidden ml-2">New</ThemedTag>
      ),
      content: (
        <div className="space-y-4">
          <VotesBubbleViewTabs />

          {votesBubble}
        </div>
      ),
    },
  ].filter(Boolean);

  const [activeTabLabel, setActiveTabLabel] = useState(
    defaultActiveTabLabel || tabs[0].label,
  );

  return (
    <div>
      <Tabs
        activeTabLabel={activeTabLabel}
        onTabClick={(tab) => setActiveTabLabel(tab.label)}
        tabs={tabs}
        tabsListExtra={
          activeTabLabel === "Timeline" && (
            <div className="max-sm:hidden">
              <TimelineModeTabs
                timelineModeTabId={timelineModeTabId}
                setTimelineModeTabId={setTimelineModeTabId}
              />
            </div>
          )
        }
      />
    </div>
  );
}

function TimelineModeTabs({ timelineModeTabId, setTimelineModeTabId }) {
  const timelineModeTabs = [
    {
      tabId: "normal",
      tabTitle: (
        <span className="inline-flex gap-x-2 text-textPrimary">
          <TimelineNormal className="w-5 h-5 [&_path]:fill-textPrimary" />
          <span className="sm:hidden">Normal</span>
        </span>
      ),
    },
    {
      tabId: "compact",
      tabTitle: (
        <span className="inline-flex gap-x-2 text-textPrimary">
          <TimelineCompact className="w-5 h-5 [&_path]:fill-textPrimary" />
          <span className="sm:hidden">Compact</span>
        </span>
      ),
    },
  ];

  return (
    <Tab
      className="sm:w-16 sm:relative sm:bottom-2"
      selectedTabId={timelineModeTabId}
      setSelectedTabId={setTimelineModeTabId}
      small
      tabs={timelineModeTabs}
    />
  );
}
