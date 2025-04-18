import { useMemo } from "react";
import Tabs from "next-common/components/tabs";
import { useRouter } from "next/router";
import dynamicClientOnly from "next-common/lib/dynamic/clientOnly";
import { usePost } from "next-common/context/post";
import { useCouncilMotionBusinessData } from "next-common/hooks/useCouncilMotionBusinessData";
import { useMotionTimelineData } from "hooks/timelineData";
import { useTimelineTabSwitch } from "next-common/hooks/useTabSwitch";

const Metadata = dynamicClientOnly(() => import("../motion/metadata"));
const Timeline = dynamicClientOnly(() =>
  import("next-common/components/timeline"),
);
const Business = dynamicClientOnly(() => import("../motion/business"));
const CollectiveCall = dynamicClientOnly(() =>
  import("next-common/components/collective/call"),
);
export default function MotionDetailMultiTabs() {
  const router = useRouter();
  const post = usePost();
  const motionBusinessData = useCouncilMotionBusinessData();
  const timelineData = useMotionTimelineData();
  const { component: timeLineTabSwitch, isCompact } = useTimelineTabSwitch();

  const { tabs, activeTabValue } = useMemo(() => {
    const tabs = [
      ...(motionBusinessData?.length
        ? [
            {
              value: "business",
              label: "Business",
              content: <Business motion={post?.onchainData} />,
            },
          ]
        : []),
      ...(post?.onchainData?.proposal
        ? [
            {
              value: "call",
              label: "Call",
              content: <CollectiveCall call={post.onchainData.proposal} />,
            },
          ]
        : []),
      { value: "metadata", label: "Metadata", content: <Metadata /> },
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
    isCompact,
    motionBusinessData?.length,
    post.onchainData,
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
