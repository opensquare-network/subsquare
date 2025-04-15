import Tabs from "next-common/components/tabs";
import { useRouter } from "next/router";
import { useMemo } from "react";
import useTreasuryTimelineData from "components/treasuryProposal/useTimelineData";
import dynamicClientOnly from "next-common/lib/dynamic/clientOnly";
import { usePost } from "next-common/context/post";
import { useTimelineTabSwitch } from "next-common/hooks/useTabSwitch";

const Metadata = dynamicClientOnly(() =>
  import("next-common/components/treasury/proposal/metadata"),
);

const Timeline = dynamicClientOnly(() =>
  import("next-common/components/timeline"),
);

export default function CommunityTreasuryProposalsDetailMultiTabs() {
  const router = useRouter();
  const detail = usePost();

  const timelineData = useTreasuryTimelineData(detail?.onchainData);
  const { component: timeLineTabSwitchComponent, isCompact } =
    useTimelineTabSwitch();

  const { tabs, activeTabValue } = useMemo(() => {
    const tabs = [
      {
        value: "metadata",
        label: "Metadata",
        content: <Metadata treasuryProposal={detail?.onchainData} />,
      },
      {
        value: "timeline",
        label: "Timeline",
        activeCount: timelineData?.length,
        content: (
          <div>
            {timeLineTabSwitchComponent}
            <Timeline data={timelineData} indent={false} compact={isCompact} />
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
