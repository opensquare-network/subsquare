import Tabs from "next-common/components/tabs";
import TimelineModeTabs from "next-common/components/detail/detailMultiTabs/timelineModeTabs";
import { useRouter } from "next/router";
import { useMemo } from "react";
import dynamicClientOnly from "next-common/lib/dynamic/clientOnly";
import { usePost } from "next-common/context/post";
import { usePageProps } from "next-common/context/page";
import { useIsTimelineCompact } from "next-common/components/detail/detailMultiTabs/timelineModeTabs";
import useBountyTimelineData from "components/bounty/useBountyTimelineData";

const Metadata = dynamicClientOnly(() =>
  import("next-common/components/treasury/bounty/metadata"),
);
const Timeline = dynamicClientOnly(() =>
  import("next-common/components/timeline"),
);
const ChildBountiesTable = dynamicClientOnly(() =>
  import("components/bounty/childBountiesTable"),
);

export default function TreasuryBountiesDetailMultiTabs() {
  const router = useRouter();
  const detail = usePost();
  const { childBounties } = usePageProps();
  const isTimelineCompact = useIsTimelineCompact();
  const timelineData = useBountyTimelineData(detail?.onchainData);

  const { tabs, activeTabValue } = useMemo(() => {
    const tabs = [
      ...(childBounties.total
        ? [
            {
              value: "child_bounties",
              label: "Child Bounties",
              activeCount: childBounties.total,
              content: <ChildBountiesTable {...{ childBounties }} />,
            },
          ]
        : []),
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
        activeCount: timelineData?.length,
        content: (
          <div>
            <TimelineModeTabs />
            <Timeline data={timelineData} compact={isTimelineCompact} />
          </div>
        ),
      },
    ];
    const [defaultTab] = tabs;
    return { tabs, activeTabValue: router.query.tab || defaultTab.value };
  }, [
    childBounties,
    detail?.bountyIndex,
    detail.onchainData?.address,
    detail.onchainData?.meta,
    isTimelineCompact,
    router.query.tab,
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
