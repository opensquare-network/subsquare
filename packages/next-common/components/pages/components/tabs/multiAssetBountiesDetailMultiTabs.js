import Tabs from "next-common/components/tabs";
import { useRouter } from "next/router";
import { useMemo } from "react";
import dynamicClientOnly from "next-common/lib/dynamic/clientOnly";
import { usePost } from "next-common/context/post";
import { usePageProps } from "next-common/context/page";
import useMultiAssetBountyTimelineData from "next-common/components/pages/components/multiAssetBounty/useMultiAssetBountyTimelineData";
import { useTimelineTabSwitch } from "next-common/hooks/useTabSwitch";
import tabsTooltipContentMap from "./tabsTooltipContentMap";

const Metadata = dynamicClientOnly(() =>
  import("next-common/components/treasury/multiAssetBounty/metadata"),
);
const Timeline = dynamicClientOnly(() =>
  import("next-common/components/timeline"),
);
const ChildBountiesTable = dynamicClientOnly(() =>
  import(
    "next-common/components/pages/components/multiAssetBounty/childBountiesTable"
  ),
);

export default function MultiAssetBountiesDetailMultiTabs() {
  const router = useRouter();
  const detail = usePost();
  const { childBounties } = usePageProps();
  const timelineData = useMultiAssetBountyTimelineData(detail?.onchainData);
  const { component: timeLineTabSwitch, isCompact } = useTimelineTabSwitch();

  const { tabs, activeTabValue } = useMemo(() => {
    const tabs = [
      ...(childBounties?.total
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
        tooltip: tabsTooltipContentMap.metadata,
        content: (
          <Metadata
            id={detail?.bountyIndex}
            meta={detail?.onchainData?.meta}
            assetKind={detail?.onchainData?.assetKind}
            address={detail?.onchainData?.address}
            description={detail?.onchainData?.description}
          />
        ),
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
    ].filter(Boolean);

    const [defaultTab] = tabs;
    return { tabs, activeTabValue: router.query.tab || defaultTab?.value };
  }, [
    childBounties,
    detail?.bountyIndex,
    detail?.onchainData?.address,
    detail?.onchainData?.assetKind,
    detail?.onchainData?.meta,
    isCompact,
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
