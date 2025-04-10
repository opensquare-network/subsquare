import Tabs from "next-common/components/tabs";
import TimelineModeTabs from "next-common/components/detail/detailMultiTabs/timelineModeTabs";
import { useRouter } from "next/router";
import { useMemo } from "react";
import dynamicClientOnly from "next-common/lib/dynamic/clientOnly";
import { usePost } from "next-common/context/post";
import useTreasuryTimelineData from "../treasuryProposal/useTimelineData";

const Metadata = dynamicClientOnly(() => import("components/tip/metadata"));

const Timeline = dynamicClientOnly(() => import("components/tip/timeline"));

export default function TreasuryTipsDetailMultiTabs() {
  const post = usePost();
  const timelineData = useTreasuryTimelineData(post?.onchainData);
  const router = useRouter();

  const { tabs, activeTabValue } = useMemo(() => {
    const tabs = [
      {
        value: "metadata",
        label: "Metadata",
        content: <Metadata tip={post?.onchainData} />,
      },
      {
        value: "timeline",
        label: "Timeline",
        activeCount: timelineData?.length,
        content: (
          <div>
            <TimelineModeTabs />
            <Timeline tip={post?.onchainData} />
          </div>
        ),
      },
    ].filter(Boolean);
    const [defaultTab] = tabs;
    return { tabs, activeTabValue: router.query.tab || defaultTab.value };
  }, [post?.onchainData, router.query.tab, timelineData?.length]);

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
