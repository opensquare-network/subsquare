import Tabs from "../../tabs";
import { useTimelineData } from "next-common/context/post";
import VotesBubbleViewTabs from "./votesBubbleViewTabs";
import { useChain } from "next-common/context/chain";
import Chains from "next-common/utils/consts/chains";
import TimelineModeTabs from "./timelineModeTabs";
import { useRouter } from "next/router";
import { isPolkadotChain } from "next-common/utils/chain";

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
  report,
}) {
  const router = useRouter();
  const timelineData = useTimelineData();
  const chain = useChain();
  const hasVotesViewTabs = ![Chains.kintsugi, Chains.interlay].includes(chain);

  const tabs = [
    business && { value: "business", label: "Business", content: business },
    call && { value: "call", label: "Call", content: call },
    childBounties && {
      value: "child_bounties",
      label: "Child Bounties",
      activeCount: childBountiesCount,
      content: childBounties,
    },
    metadata && { value: "metadata", label: "Metadata", content: metadata },
    timeline && {
      value: "timeline",
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
      value: "votes_bubble",
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
      value: "statistics",
      label: "Statistics",
      content: <div className="space-y-4">{statistics}</div>,
    },
    isPolkadotChain(chain) &&
      report && {
        value: "report",
        label: "Report",
        activeCount: (
          <span className="ml-1 rounded-full py-0.5 px-2 text12Medium text-theme500 bg-theme100">
            new
          </span>
        ),
        content: <div className="space-y-4">{report}</div>,
      },
  ].filter(Boolean);

  const activeTabValue = router.query.tab || tabs[0].value;

  function handleTabClick(tab) {
    router.replace(
      {
        query: {
          id: router.query.id,
          tab: tab.value,
        },
      },
      null,
      { shallow: true },
    );
  }

  return (
    <div>
      <Tabs
        activeTabValue={activeTabValue}
        onTabClick={handleTabClick}
        tabs={tabs}
      />
    </div>
  );
}
