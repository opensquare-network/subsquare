import { cloneElement, useState } from "react";
import Tabs from "../../tabs";
import { useTimelineData } from "next-common/context/post";
import { ThemedTag } from "next-common/components/tags/state/styled";
import VotesBubbleViewTabs from "./votesBubbleViewTabs";
import { useChain } from "next-common/context/chain";
import Chains from "next-common/utils/consts/chains";
import TimelineModeTabs from "./timelineModeTabs";

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
  const chain = useChain();
  const hasVotesViewTabs = ![Chains.kintsugi, Chains.interlay].includes(chain);

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
          <TimelineModeTabs
            tabId={timelineModeTabId}
            setTabId={setTimelineModeTabId}
          />

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
          {hasVotesViewTabs && <VotesBubbleViewTabs />}

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
      />
    </div>
  );
}
