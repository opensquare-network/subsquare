import { usePost } from "next-common/context/post";
import useBountyTimelineData from "./useBountyTimelineData";
import { useIsTimelineCompact } from "next-common/components/detail/detailMultiTabs/timelineModeTabs";
import { usePageProps } from "next-common/context/page";
import dynamicClientOnly from "next-common/lib/dynamic/clientOnly";
import Tabs from "next-common/components/tabs";
import { useMemo } from "react";
import { useTimelineData } from "next-common/context/post";
import TimelineModeTabs from "next-common/components/detail/detailMultiTabs/timelineModeTabs";
import { useRouter } from "next/router";

const ChildBountiesTable = dynamicClientOnly(() =>
  import("./childBountiesTable"),
);
const Metadata = dynamicClientOnly(() =>
  import("next-common/components/treasury/bounty/metadata"),
);
const Timeline = dynamicClientOnly(() =>
  import("next-common/components/timeline"),
);

export default function BountyDetailMultiTabs() {
  const { childBounties } = usePageProps();
  const detail = usePost();
  const timelineData = useTimelineData();

  const bountyTimelineData = useBountyTimelineData(detail?.onchainData);
  const isTimelineCompact = useIsTimelineCompact();
  const router = useRouter();

  const { tabs, activeTabValue } = useMemo(() => {
    const tabs = [
      !!childBounties.total && {
        value: "child_bounties",
        label: "Child Bounties",
        activeCount: childBounties.total,
        content: <ChildBountiesTable {...{ childBounties }} />,
      },
      {
        value: "metadata",
        label: "Metadata",
        content: (
          <Metadata
            id={detail?.bountyIndex}
            meta={detail.onchainData?.meta}
            address={detail.onchainData?.address}
          />
        ),
      },
      {
        value: "timeline",
        label: "Timeline",
        activeCount: bountyTimelineData.length || timelineData?.length,
        content: (
          <div>
            <TimelineModeTabs />
            <Timeline data={timelineData} compact={isTimelineCompact} />
          </div>
        ),
      },
    ].filter(Boolean);
    const [defaultTab] = tabs;
    return { tabs, activeTabValue: router.query.tab || defaultTab.value };
  }, [
    bountyTimelineData.length,
    childBounties,
    detail?.bountyIndex,
    detail.onchainData?.address,
    detail.onchainData?.meta,
    isTimelineCompact,
    router.query.tab,
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
        activeTabValue={activeTabValue}
        tabs={tabs}
        onTabClick={onTabClick}
      />
    </div>
  );
}
