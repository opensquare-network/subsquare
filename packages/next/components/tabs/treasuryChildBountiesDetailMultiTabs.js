import Tabs from "next-common/components/tabs";
import { useTimelineData } from "next-common/context/post";
import TimelineModeTabs from "next-common/components/detail/detailMultiTabs/timelineModeTabs";
import { useRouter } from "next/router";
import { useMemo } from "react";
import dynamicClientOnly from "next-common/lib/dynamic/clientOnly";
import { usePost } from "next-common/context/post";

const Metadata = dynamicClientOnly(() =>
  import("next-common/components/treasury/bounty/metadata"),
);

const Timeline = dynamicClientOnly(() =>
  import("components/childBounty/timeline"),
);

export default function TreasuryChildBountiesDetailMultiTabs() {
  const router = useRouter();
  const timelineData = useTimelineData();
  const post = usePost();

  const { tabs, activeTabValue } = useMemo(() => {
    const tabs = [
      {
        value: "metadata",
        label: "Metadata",
        content: (
          <Metadata
            id={post?.index}
            meta={post?.onchainData?.meta}
            address={post?.onchainData?.address}
          />
        ),
      },
      {
        value: "timeline",
        label: "Timeline",
        activeCount: timelineData?.length,
        content: (
          <div>
            <TimelineModeTabs />
            <Timeline onchainData={post?.onchainData} />
          </div>
        ),
      },
    ].filter(Boolean);
    const [defaultTab] = tabs;
    return { tabs, activeTabValue: router.query.tab || defaultTab.value };
  }, [post?.index, post?.onchainData, router.query.tab, timelineData?.length]);

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
