import { useMemo } from "react";
import { useRouter } from "next/router";
import Tabs from "next-common/components/tabs";
import DemocracyReferendumCallProvider from "next-common/context/democracy/referenda/call";
import dynamicClientOnly from "next-common/lib/dynamic/clientOnly";
import { usePost } from "next-common/context/post";
import useInlineCall from "next-common/components/democracy/metadata/useInlineCall";
import { useChain } from "next-common/context/chain";
import Chains from "next-common/utils/consts/chains";
import VotesBubbleViewTabs from "next-common/components/detail/detailMultiTabs/votesBubbleViewTabs";
import { useTimelineTabSwitch } from "next-common/hooks/useTabSwitch";
import { useDemocracyReferendaProposalTimelineData } from "next-common/hooks/pages/timelineData";
import tabsTooltipContentMap from "./tabsTooltipContentMap";
import { MigrationConditionalApiProvider } from "next-common/context/migration/conditionalApi";
import useDemocracyReferendumStatus from "next-common/hooks/democracy/useDemocracyReferendumStatus";

const Timeline = dynamicClientOnly(() =>
  import("next-common/components/timeline"),
);
const ReferendumMetadata = dynamicClientOnly(() =>
  import("next-common/components/democracy/metadata"),
);
const ReferendumCall = dynamicClientOnly(() =>
  import("next-common/components/democracy/call"),
);
const DemocracyReferendaVotesBubble = dynamicClientOnly(() =>
  import("next-common/components/democracy/referendum/votesBubble"),
);

export default function DemocracyReferendaDetailMultiTabs() {
  const router = useRouter();
  const post = usePost();
  const timelineData = useDemocracyReferendaProposalTimelineData();
  const chain = useChain();
  const hasVotesViewTabs = ![Chains.kintsugi, Chains.interlay].includes(chain);

  const onchainData = post?.onchainData;

  const { preImage, indexer } = onchainData;
  const referendumStatus = useDemocracyReferendumStatus();
  const proposal = referendumStatus?.proposal;

  const { call: inlineCall } = useInlineCall(proposal);
  const call = preImage?.call || inlineCall;
  const { component: timeLineTabSwitch, isCompact } = useTimelineTabSwitch();

  const { tabs, activeTabValue } = useMemo(() => {
    const tabs = [
      {
        value: "call",
        label: "Call",
        tooltip: tabsTooltipContentMap.call,
        content: (
          <MigrationConditionalApiProvider indexer={indexer}>
            <DemocracyReferendumCallProvider>
              <ReferendumCall
                call={call || inlineCall}
                shorten={post?.onchainData?.preImage?.shorten}
                onchainData={post?.onchainData}
              />
            </DemocracyReferendumCallProvider>
          </MigrationConditionalApiProvider>
        ),
      },
      {
        value: "metadata",
        label: "Metadata",
        tooltip: tabsTooltipContentMap.metadata,
        content: (
          <ReferendumMetadata
            proposer={post?.proposer}
            status={referendumStatus ?? {}}
            call={post?.onchainData?.preImage?.call || post?.onchainData?.call}
            shorten={post?.onchainData?.preImage?.shorten}
            onchainData={post?.onchainData}
          />
        ),
      },
      {
        value: "timeline",
        label: "Timeline",
        activeCount: timelineData?.length,
        content: (
          <div>
            {timeLineTabSwitch}
            <Timeline data={timelineData} compact={isCompact} />
          </div>
        ),
      },
      {
        lazy: true,
        value: "votes_bubble",
        label: "Votes Bubble",
        tooltip: tabsTooltipContentMap.votesBubble,
        content: (
          <div className="space-y-4">
            {hasVotesViewTabs && <VotesBubbleViewTabs />}
            <DemocracyReferendaVotesBubble />
          </div>
        ),
      },
    ];
    const [defaultTab] = tabs;
    return { tabs, activeTabValue: router.query.tab || defaultTab.value };
  }, [
    call,
    hasVotesViewTabs,
    indexer,
    inlineCall,
    isCompact,
    post?.onchainData,
    post?.proposer,
    referendumStatus,
    router.query.tab,
    timeLineTabSwitch,
    timelineData,
  ]);

  function onTabClick(tab) {
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
        tabs={tabs}
        activeTabValue={activeTabValue}
        onTabClick={onTabClick}
      />
    </div>
  );
}
