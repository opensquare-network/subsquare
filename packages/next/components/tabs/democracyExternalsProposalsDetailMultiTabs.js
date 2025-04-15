import { usePost } from "next-common/context/post";
import dynamicClientOnly from "next-common/lib/dynamic/clientOnly";
import DemocracyReferendumCallProvider from "next-common/context/democracy/referenda/call";
import { useMemo } from "react";
import { useRouter } from "next/router";
import Tabs from "next-common/components/tabs";
import { useTimelineTabSwitch } from "next-common/hooks/useTabSwitch";
import { useDemocracyExternalProposalTimelineData } from "hooks/timelineData";

const Business = dynamicClientOnly(() =>
  import("components/external/business"),
);

const Metadata = dynamicClientOnly(() =>
  import("components/external/metadata"),
);

const DemocracyExternalProposalCall = dynamicClientOnly(() =>
  import("components/external/call"),
);

const Timeline = dynamicClientOnly(() =>
  import("next-common/components/timeline"),
);

export default function DemocracyExternalsProposalsDetailMultiTabs() {
  const detail = usePost();
  const router = useRouter();
  const timelineData = useDemocracyExternalProposalTimelineData();

  const external = detail?.onchainData || {};
  const call = external?.preImage?.call;
  const { component: timeLineTabSwitch, isCompact } = useTimelineTabSwitch();

  const { tabs, activeTabValue } = useMemo(() => {
    const tabs = [
      {
        value: "business",
        label: "Business",
        content: <Business external={detail?.onchainData} />,
      },
      ...(call
        ? [
            {
              value: "call",
              label: "Call",
              content: (
                <DemocracyReferendumCallProvider>
                  <DemocracyExternalProposalCall
                    call={call}
                    shorten={external.preImage.shorten}
                    motionIndex={external.motionIndex}
                    referendumIndex={external.referendumIndex}
                  />
                </DemocracyReferendumCallProvider>
              ),
            },
          ]
        : []),
      {
        value: "metadata",
        label: "Metadata",
        content: <Metadata external={detail?.onchainData} />,
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
    detail?.onchainData,
    external.motionIndex,
    external.preImage.shorten,
    external.referendumIndex,
    isCompact,
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
