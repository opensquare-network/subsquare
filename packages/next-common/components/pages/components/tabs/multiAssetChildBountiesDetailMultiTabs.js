import Tabs from "next-common/components/tabs";
import { useRouter } from "next/router";
import { useMemo } from "react";
import dynamicClientOnly from "next-common/lib/dynamic/clientOnly";
import { usePost } from "next-common/context/post";
import { useTimelineTabSwitch } from "next-common/hooks/useTabSwitch";
import useMultiAssetChildBountyTimelineData from "next-common/components/pages/components/multiAssetChildBounty/useMultiAssetChildBountyTimelineData";
import tabsTooltipContentMap from "./tabsTooltipContentMap";

const Metadata = dynamicClientOnly(() =>
  import("next-common/components/treasury/multiAssetBounty/metadata"),
);

const Timeline = dynamicClientOnly(() =>
  import("next-common/components/timeline"),
);

export default function MultiAssetChildBountiesDetailMultiTabs() {
  const router = useRouter();
  const detail = usePost();
  const timelineData = useMultiAssetChildBountyTimelineData(
    detail?.onchainData,
  );
  const { component: timeLineTabSwitch, isCompact } = useTimelineTabSwitch();

  const { tabs, activeTabValue } = useMemo(() => {
    const tabs = [
      {
        value: "metadata",
        label: "Metadata",
        tooltip: tabsTooltipContentMap.metadata,
        content: (
          <Metadata
            id={detail?.index}
            meta={detail?.onchainData?.meta}
            assetKind={detail?.onchainData?.assetKind}
            address={detail?.onchainData?.address}
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
    ];
    const [defaultTab] = tabs;
    return { tabs, activeTabValue: router.query.tab || defaultTab?.value };
  }, [
    detail?.index,
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
