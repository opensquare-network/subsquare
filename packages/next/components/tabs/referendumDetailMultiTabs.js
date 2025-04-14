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
import { useReferendumTimelineData } from "hooks/timelineData";

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

export default function ReferendumDetailMultiTabs() {
  const chain = useChain();
  const hasVotesViewTabs = ![Chains.kintsugi, Chains.interlay].includes(chain);
  const router = useRouter();

  const info = useReferendumInfo();
  const onchainData = useOnchainData();
  const proposal = onchainData?.proposal ?? {};
  const referendumDetailForOGTrack = useOgTrackerReferendumDetail();
  const { component: timeLineTabSwitchComponent, timelineModeIsCompact } =
    useTimelineTabSwitch();
  const timelineData = useReferendumTimelineData();

  const { tabs, activeTabValue } = useMemo(() => {
    const tabs = [
      ...(proposal?.call
        ? [
            {
              value: "call",
              label: "Call",
              content: (
                <>
                  <ReferendumCallProvider>
                    <Gov2ReferendumCall />
                  </ReferendumCallProvider>
                </>
              ),
            },
          ]
        : []),
      {
        value: "metadata",
        label: "Metadata",
        content: <Gov2ReferendumMetadata info={info} />,
      },
      {
        value: "timeline",
        label: "Timeline",
        activeCount: timelineData?.length,
        content: (
          <div>
            {timeLineTabSwitchComponent}
            <Timeline data={timelineData} compact={timelineModeIsCompact} />
          </div>
        ),
      },
      {
        // NOTE: must have `lazy` flag
        lazy: true,
        value: "votes_bubble",
        label: "Votes Bubble",
        content: (
          <div className="space-y-4">
            {hasVotesViewTabs && <VotesBubbleViewTabs />}
            <Gov2ReferendaVotesBubble />
          </div>
        ),
      },
      {
        // lazy: true,
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
              activeCount: (
                <span className="ml-1 rounded-full py-0.5 px-2 text12Medium text-theme500 bg-theme100">
                  new
                </span>
              ),
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
    chain,
    hasVotesViewTabs,
    info,
    proposal?.call,
    referendumDetailForOGTrack.detail,
    router.query.tab,
    timeLineTabSwitchComponent,
    timelineModeIsCompact,
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
