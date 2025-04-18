import Tabs from "next-common/components/tabs";
import { useRouter } from "next/router";
import { useMemo } from "react";
import dynamicClientOnly from "next-common/lib/dynamic/clientOnly";
import { usePost } from "next-common/context/post";
import { useTimelineTabSwitch } from "next-common/hooks/useTabSwitch";
import { useAllianceAnnouncementTimelineData } from "hooks/timelineData";

const Timeline = dynamicClientOnly(() =>
  import("next-common/components/timeline"),
);

export default function AllianceAnnouncementsDetailMultiTabs() {
  const router = useRouter();
  const detail = usePost();
  const timelineData = useAllianceAnnouncementTimelineData();
  const { component: timeLineTabSwitchComponent, isCompact } =
    useTimelineTabSwitch();

  const { tabs, activeTabValue } = useMemo(() => {
    const tabs = [
      {
        value: "timeline",
        label: "Timeline",
        activeCount: timelineData?.length,
        content: (
          <div>
            {timeLineTabSwitchComponent}
            <Timeline
              data={detail?.onchainData}
              indent={false}
              compace={isCompact}
            />
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
    timeLineTabSwitchComponent,
    timelineData?.length,
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
