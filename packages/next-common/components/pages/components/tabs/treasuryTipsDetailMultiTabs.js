import Tabs from "next-common/components/tabs";
import { useRouter } from "next/router";
import { useMemo } from "react";
import dynamicClientOnly from "next-common/lib/dynamic/clientOnly";
import { usePost } from "next-common/context/post";
import { useTreasuryTipsTimelineData } from "next-common/hooks/pages/timelineData";
import { useTimelineTabSwitch } from "next-common/hooks/useTabSwitch";
import tabsTooltipContentMap from "./tabsTooltipContentMap";

const Metadata = dynamicClientOnly(() =>
  import("next-common/components/pages/components/tip/metadata"),
);

const Timeline = dynamicClientOnly(() =>
  import("next-common/components/timeline"),
);

export default function TreasuryTipsDetailMultiTabs() {
  const post = usePost();
  const timelineData = useTreasuryTipsTimelineData();
  const router = useRouter();
  const { component: timeLineTabSwitch, isCompact } = useTimelineTabSwitch();

  const { tabs, activeTabValue } = useMemo(() => {
    const tabs = [
      {
        value: "metadata",
        label: "Metadata",
        tooltip: tabsTooltipContentMap.metadata,
        content: <Metadata tip={post?.onchainData} />,
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
    isCompact,
    post?.onchainData,
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
