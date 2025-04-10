import Tabs from "next-common/components/tabs";
import { useTimelineData } from "next-common/context/post";
import TimelineModeTabs from "next-common/components/detail/detailMultiTabs/timelineModeTabs";
import { useRouter } from "next/router";
import { useMemo } from "react";
import dynamicClientOnly from "next-common/lib/dynamic/clientOnly";
import { usePost } from "next-common/context/post";

const AnnouncementTimeline = dynamicClientOnly(() =>
  import("next-common/components/alliance/announcement/timeline"),
);

export default function AllianceAnnouncementsDetailMultiTabs() {
  const router = useRouter();
  const timelineData = useTimelineData();
  const detail = usePost();

  const { tabs, activeTabValue } = useMemo(() => {
    const tabs = [
      {
        value: "timeline",
        label: "Timeline",
        activeCount: timelineData?.length,
        content: (
          <div>
            <TimelineModeTabs />

            <AnnouncementTimeline data={detail?.onchainData} />
          </div>
        ),
      },
    ].filter(Boolean);
    const [defaultTab] = tabs;
    return { tabs, activeTabValue: router.query.tab || defaultTab.value };
  }, [detail?.onchainData, router.query.tab, timelineData?.length]);

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
