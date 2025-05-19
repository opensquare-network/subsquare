import Tabs from "next-common/components/tabs";
import { useRouter } from "next/router";
import { useMemo } from "react";
import dynamicClientOnly from "next-common/lib/dynamic/clientOnly";
import { usePost } from "next-common/context/post";
import useTreasurySpendTimelineData from "next-common/hooks/treasury/spend/useTreasurySpendTimelineData";
import { useTimelineTabSwitch } from "next-common/hooks/useTabSwitch";

const TreasurySpendMetadata = dynamicClientOnly(() =>
  import("next-common/components/detail/treasury/spend/metadata"),
);

const Timeline = dynamicClientOnly(() =>
  import("next-common/components/timeline"),
);

export default function FellowshipTreasurySpeedsDetailMultiTabs() {
  const router = useRouter();
  const detail = usePost();
  const timelineData = useTreasurySpendTimelineData(detail?.onchainData);
  const { component: timeLineTabSwitch, isCompact } = useTimelineTabSwitch();

  const { tabs, activeTabValue } = useMemo(() => {
    const tabs = [
      {
        value: "metadata",
        label: "Metadata",
        content: <TreasurySpendMetadata spend={detail?.onchainData} />,
      },
      {
        value: "timeline",
        label: "Timeline",
        activeCount: timelineData?.length,
        content: (
          <div>
            {timeLineTabSwitch}
            <Timeline data={timelineData} indent={false} compact={isCompact} />
          </div>
        ),
      },
    ];
    const [defaultTab] = tabs;
    return { tabs, activeTabValue: router.query.tab || defaultTab.value };
  }, [
    detail?.onchainData,
    isCompact,
    router.query.tab,
    timeLineTabSwitch,
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
