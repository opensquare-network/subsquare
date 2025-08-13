import { useOnchainData } from "next-common/context/post";
import { useMemo } from "react";
import { useReferendumInfo } from "next-common/hooks/referenda/useReferendumInfo";
import VotesBubbleViewTabs from "next-common/components/detail/detailMultiTabs/votesBubbleViewTabs";
import Tabs from "next-common/components/tabs";
import dynamicClientOnly from "next-common/lib/dynamic/clientOnly";
import ReferendumCallProvider from "next-common/context/referenda/call";
import useOgTrackerReferendumDetail from "next-common/hooks/referenda/useOgTrackerReferendumDetail";
import { isPolkadotChain } from "next-common/utils/chain";
import { useChain } from "next-common/context/chain";
import Chains from "next-common/utils/consts/chains";
import { useRouter } from "next/router";
import { useTimelineTabSwitch } from "next-common/hooks/useTabSwitch";
import { useReferendumTimelineData } from "next-common/hooks/pages/timelineData";
import tabsTooltipContentMap from "./tabsTooltipContentMap";
import { MigrationConditionalApiProvider } from "next-common/context/migration/conditionalApi";

const Gov2ReferendumCall = dynamicClientOnly(() =>
  import("next-common/components/gov2/referendum/call"),
);
const ProposalAddress = dynamicClientOnly(() =>
  import("next-common/components/statistics/referenda/proposalAddress"),
);
const Gov2ReferendumMetadata = dynamicClientOnly(() =>
  import("next-common/components/gov2/referendum/metadata"),
);
const Timeline = dynamicClientOnly(() =>
  import("next-common/components/timeline"),
);
const Gov2ReferendaVotesBubble = dynamicClientOnly(() =>
  import("next-common/components/gov2/referendum/votesBubble"),
);
const ReferendumReport = dynamicClientOnly(() => import("../referenda/report"));
const CurvesChart = dynamicClientOnly(() =>
  import(
    "next-common/components/charts/thresholdCurve/referendaCurveChart/curvesChart"
  ),
);

export default function ReferendumDetailMultiTabs() {
  const chain = useChain();
  const hasVotesViewTabs = ![Chains.kintsugi, Chains.interlay].includes(chain);
  const router = useRouter();

  const info = useReferendumInfo();
  const onchainData = useOnchainData();
  const proposal = onchainData?.proposal ?? {};
  const referendumDetailForOGTrack = useOgTrackerReferendumDetail();
  const { component: timeLineTabSwitchComponent, isCompact } =
    useTimelineTabSwitch();
  const timelineData = useReferendumTimelineData();
  const indexer = onchainData?.indexer;

  const { tabs, activeTabValue } = useMemo(() => {
    const tabs = [
      ...(proposal?.call
        ? [
            {
              value: "call",
              label: "Call",
              tooltip: tabsTooltipContentMap.call,
              content: (
                <MigrationConditionalApiProvider indexer={indexer}>
                  <ReferendumCallProvider>
                    <Gov2ReferendumCall />
                  </ReferendumCallProvider>
                </MigrationConditionalApiProvider>
              ),
            },
          ]
        : []),
      {
        value: "metadata",
        label: "Metadata",
        tooltip: tabsTooltipContentMap.metadata,
        content: <Gov2ReferendumMetadata info={info} />,
      },
      {
        value: "timeline",
        label: "Timeline",
        activeCount: timelineData?.length,
        content: (
          <div>
            {timeLineTabSwitchComponent}
            <Timeline data={timelineData} compact={isCompact} />
          </div>
        ),
      },
      {
        // NOTE: must have `lazy` flag
        lazy: true,
        value: "votes_bubble",
        label: "Votes Bubble",
        tooltip: tabsTooltipContentMap.votesBubble,
        content: (
          <div className="space-y-4">
            {hasVotesViewTabs && <VotesBubbleViewTabs />}
            <Gov2ReferendaVotesBubble />
          </div>
        ),
      },
      {
        lazy: true,
        value: "curves",
        label: "Curves",
        content: (
          <div className="space-y-4">
            <CurvesChart />
          </div>
        ),
      },
      {
        value: "statistics",
        label: "Statistics",
        content: (
          <div className="space-y-4">
            <ProposalAddress />
          </div>
        ),
      },
      ...(isPolkadotChain(chain) && referendumDetailForOGTrack.detail
        ? [
            {
              value: "report",
              label: "Report",
              lazy: true,
              tooltip: tabsTooltipContentMap.report,
              content: (
                <div className="space-y-4">
                  <ReferendumReport
                    detail={referendumDetailForOGTrack.detail}
                  />
                </div>
              ),
            },
          ]
        : []),
    ];
    const [defaultTab] = tabs;
    return { tabs, activeTabValue: router.query.tab || defaultTab.value };
  }, [
    proposal?.call,
    indexer,
    info,
    timelineData,
    timeLineTabSwitchComponent,
    isCompact,
    hasVotesViewTabs,
    chain,
    referendumDetailForOGTrack.detail,
    router.query.tab,
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
