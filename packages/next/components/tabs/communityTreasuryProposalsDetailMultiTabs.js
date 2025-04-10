import Tabs from "next-common/components/tabs";
import TimelineModeTabs from "next-common/components/detail/detailMultiTabs/timelineModeTabs";
import { useRouter } from "next/router";
import { useMemo } from "react";
import useTreasuryTimelineData from "components/treasuryProposal/useTimelineData";
import { useIsTimelineCompact } from "next-common/components/detail/detailMultiTabs/timelineModeTabs";
import dynamicClientOnly from "next-common/lib/dynamic/clientOnly";
import { usePost } from "next-common/context/post";

const Metadata = dynamicClientOnly(() =>
  import("next-common/components/treasury/proposal/metadata"),
);

const Timeline = dynamicClientOnly(() =>
  import("next-common/components/timeline"),
);

export default function CommunityTreasuryProposalsDetailMultiTabs() {
  const router = useRouter();
  const detail = usePost();

  const timelineData = useTreasuryTimelineData(detail?.onchainData);
  const isTimelineCompact = useIsTimelineCompact();

  const { tabs, activeTabValue } = useMemo(() => {
    const tabs = [
      {
        value: "metadata",
        label: "Metadata",
        content: <Metadata treasuryProposal={detail?.onchainData} />,
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
