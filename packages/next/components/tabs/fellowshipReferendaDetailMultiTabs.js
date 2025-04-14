import Tabs from "next-common/components/tabs";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { useReferendumInfo } from "next-common/hooks/referenda/useReferendumInfo";
import { useOnchainData } from "next-common/context/post";
import ReferendumCallProvider from "next-common/context/referenda/call";
import dynamicClientOnly from "next-common/lib/dynamic/clientOnly";
import { useTimelineSwitch } from "next-common/hooks/useSwitch";
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

export default function FellowshipReferendaDetailMultiTabs() {
  const router = useRouter();
  const info = useReferendumInfo();
  const onchainData = useOnchainData();
  const proposal = onchainData?.proposal ?? {};

  const { component: timeLineSwitchComponent, timeModeIsCompact } =
    useTimelineSwitch();
  const timelineData = useReferendumTimelineData();

  const { tabs, activeTabValue } = useMemo(() => {
    const tabs = [
      ...(proposal?.call || proposal.inline
        ? [
            {
              value: "call",
              label: "Call",
              content: (
                <ReferendumCallProvider>
                  <Gov2ReferendumCall />
                </ReferendumCallProvider>
              ),
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
            {timeLineSwitchComponent}
            <Timeline data={timelineData} compact={timeModeIsCompact} />
          </div>
        ),
      },
    ];
    const [defaultTab] = tabs;
    return { tabs, activeTabValue: router.query.tab || defaultTab.value };
  }, [
    info,
    proposal?.call,
    proposal.inline,
    router.query.tab,
    timeLineSwitchComponent,
    timeModeIsCompact,
    timelineData,
  ]);

  // console.log(tabs);

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
