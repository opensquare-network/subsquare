import { usePost } from "next-common/context/post";
import dynamicClientOnly from "next-common/lib/dynamic/clientOnly";
import DemocracyReferendumCallProvider from "next-common/context/democracy/referenda/call";
import { useMemo } from "react";
import Tabs from "next-common/components/tabs";
import { useRouter } from "next/router";
import { useTimelineTabSwitch } from "next-common/hooks/useTabSwitch";
import { useDemocracyPublicProposalTimelineData } from "hooks/timelineData";

const Metadata = dynamicClientOnly(() =>
  import("next-common/components/publicProposal/metadata"),
);
const DemocracyPublicProposalCall = dynamicClientOnly(() =>
  import("next-common/components/publicProposal/call"),
);
const Timeline = dynamicClientOnly(() =>
  import("next-common/components/timeline"),
);

export default function DemocracyPublicProposalsDetailMultiTabs() {
  const post = usePost();
  const timelineData = useDemocracyPublicProposalTimelineData();

  const router = useRouter();

  const publicProposal = post?.onchainData;
  const call = publicProposal?.preImage?.call || publicProposal?.call;
  const { component: timeLineTabSwitch, isCompact } = useTimelineTabSwitch();

  const { tabs, activeTabValue } = useMemo(() => {
    const tabs = [
      ...(call
        ? [
            {
              value: "call",
              label: "Call",
              content: (
                <DemocracyReferendumCallProvider>
                  <DemocracyPublicProposalCall
                    call={call}
                    shorten={publicProposal.preImage?.shorten}
                    proposalIndex={publicProposal.proposalIndex}
                    referendumIndex={publicProposal.referendumIndex}
                  />
                </DemocracyReferendumCallProvider>
              ),
            },
          ]
        : []),
      {
        value: "metadata",
        label: "Metadata",
        content: <Metadata publicProposal={post?.onchainData} />,
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
    ];
    const [defaultTab] = tabs;
    return { tabs, activeTabValue: router.query.tab || defaultTab.value };
  }, [
    call,
    isCompact,
    post?.onchainData,
    publicProposal.preImage?.shorten,
    publicProposal.proposalIndex,
    publicProposal.referendumIndex,
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
