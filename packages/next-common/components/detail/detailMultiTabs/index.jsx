import Tabs from "../../tabs";
import { useTimelineData } from "next-common/context/post";
import VotesBubbleViewTabs from "./votesBubbleViewTabs";
import { useChain } from "next-common/context/chain";
import Chains from "next-common/utils/consts/chains";
import TimelineModeTabs from "./timelineModeTabs";
import { useRouter } from "next/router";
import { snakeCase, startCase } from "lodash-es";

export default function DetailMultiTabs({
  call,
  childBounties,
  childBountiesCount,
  business,
  metadata,
  timeline,
  timelineCount,
  votesBubble,
  statistics,
}) {
  const router = useRouter();
  const timelineData = useTimelineData();
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
          <TimelineModeTabs />

          {timeline}
        </div>
      ),
    },
    votesBubble && {
      // NOTE: must have `lazy` flag
      lazy: true,
      label: "Votes Bubble",
      content: (
        <div className="space-y-4">
          {hasVotesViewTabs && <VotesBubbleViewTabs />}
          {votesBubble}
        </div>
      ),
    },
    statistics && {
      // lazy: true,
      label: "Statistics",
      content: <div className="space-y-4">{statistics}</div>,
    },
  ].filter(Boolean);

  const activeTabLabel = startCase(router.query.tab) || tabs[0].label;

  function handleTabClick(tab) {
    router.replace(
      {
        query: {
          id: router.query.id,
          tab: snakeCase(tab.label),
        },
      },
      null,
      { shallow: true },
    );
  }

  return (
    <div>
      <Tabs
        activeTabLabel={activeTabLabel}
        onTabClick={handleTabClick}
        tabs={tabs}
      />
    </div>
  );
}
