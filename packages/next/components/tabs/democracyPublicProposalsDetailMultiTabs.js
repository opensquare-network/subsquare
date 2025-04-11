import { usePost } from "next-common/context/post";
import dynamicClientOnly from "next-common/lib/dynamic/clientOnly";
import DemocracyReferendumCallProvider from "next-common/context/democracy/referenda/call";
import { useMemo } from "react";
import Tabs from "next-common/components/tabs";
import { useRouter } from "next/router";
import { useTimelineData } from "next-common/context/post";
import TimelineModeTabs from "next-common/components/detail/detailMultiTabs/timelineModeTabs";

const Metadata = dynamicClientOnly(() =>
  import("next-common/components/publicProposal/metadata"),
);
const DemocracyPublicProposalCall = dynamicClientOnly(() =>
  import("next-common/components/publicProposal/call"),
);
const Timeline = dynamicClientOnly(() =>
  import("components/publicProposal/timeline"),
);

export default function DemocracyPublicProposalsDetailMultiTabs() {
  const post = usePost();
  const timelineData = useTimelineData();

  const router = useRouter();

  const publicProposal = post?.onchainData;
  const call = publicProposal?.preImage?.call || publicProposal?.call;

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
            <TimelineModeTabs />
            <Timeline />
          </div>
        ),
      },
    ];
    const [defaultTab] = tabs;
    return { tabs, activeTabValue: router.query.tab || defaultTab.value };
  }, [
    call,
    post?.onchainData,
    publicProposal.preImage?.shorten,
    publicProposal.proposalIndex,
    publicProposal.referendumIndex,
    router.query.tab,
    timelineData?.length,
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
