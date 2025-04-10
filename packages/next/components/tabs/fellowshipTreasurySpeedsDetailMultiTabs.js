import Tabs from "next-common/components/tabs";
import TimelineModeTabs from "next-common/components/detail/detailMultiTabs/timelineModeTabs";
import { useRouter } from "next/router";
import { useMemo } from "react";
import dynamicClientOnly from "next-common/lib/dynamic/clientOnly";
import { usePost } from "next-common/context/post";
import useTreasurySpendTimelineData from "next-common/hooks/treasury/spend/useTreasurySpendTimelineData";
import { useIsTimelineCompact } from "next-common/components/detail/detailMultiTabs/timelineModeTabs";

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
  const isTimelineCompact = useIsTimelineCompact();

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
            <TimelineModeTabs />

            <Timeline
              data={timelineData}
              indent={false}
              compact={isTimelineCompact}
            />
          </div>
        ),
      },
    ].filter(Boolean);
    const [defaultTab] = tabs;
    return { tabs, activeTabValue: router.query.tab || defaultTab.value };
  }, [detail?.onchainData, isTimelineCompact, router.query.tab, timelineData]);

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
