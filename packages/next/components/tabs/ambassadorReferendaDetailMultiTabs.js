import Tabs from "next-common/components/tabs";
import dynamicClientOnly from "next-common/lib/dynamic/clientOnly";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { useOnchainData } from "next-common/context/post";
import { useReferendumInfo } from "next-common/hooks/referenda/useReferendumInfo";
import { useTimelineTabSwitch } from "next-common/hooks/useTabSwitch";
import { useReferendumTimelineData } from "hooks/timelineData";

const Gov2ReferendumMetadata = dynamicClientOnly(() =>
  import("next-common/components/gov2/referendum/metadata"),
);

const Timeline = dynamicClientOnly(() =>
  import("next-common/components/timeline"),
);

const Gov2ReferendumCall = dynamicClientOnly(() =>
  import("next-common/components/gov2/referendum/call"),
);

export default function AmbassadorReferendaDetailMultiTabs() {
  const router = useRouter();
  const info = useReferendumInfo();
  const onchainData = useOnchainData();
  const proposal = onchainData?.proposal ?? {};
  const timelineData = useReferendumTimelineData();
  const { component: timeLineTabSwitchComponent, isCompact } =
    useTimelineTabSwitch();

  const { tabs, activeTabValue } = useMemo(() => {
    const tabs = [
      ...(proposal?.call || proposal.inline
        ? [
            {
              value: "call",
              label: "Call",
              content: <Gov2ReferendumCall />,
            },
          ]
        : []),

      {
        value: "metadata",
        label: "Metadata",
        content: (
          <Gov2ReferendumMetadata info={info} pallet="fellowshipReferenda" />
        ),
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
    ].filter(Boolean);
    const [defaultTab] = tabs;
    return { tabs, activeTabValue: router.query.tab || defaultTab.value };
  }, [
    info,
    proposal?.call,
    proposal.inline,
    router.query.tab,
    timeLineTabSwitchComponent,
    isCompact,
    timelineData,
  ]);

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
