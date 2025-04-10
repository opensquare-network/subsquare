import Tabs from "next-common/components/tabs";
import { useTimelineData } from "next-common/context/post";
import dynamicClientOnly from "next-common/lib/dynamic/clientOnly";
import TimelineModeTabs from "next-common/components/detail/detailMultiTabs/timelineModeTabs";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { useOnchainData, usePost } from "next-common/context/post";
import { useReferendumInfo } from "next-common/hooks/referenda/useReferendumInfo";

const Gov2ReferendumMetadata = dynamicClientOnly(() =>
  import("next-common/components/gov2/referendum/metadata"),
);

const Timeline = dynamicClientOnly(() => import("components/gov2/timeline"));

const Gov2ReferendumCall = dynamicClientOnly(() =>
  import("next-common/components/gov2/referendum/call"),
);

export default function AmbassadorReferendaDetailMultiTabs() {
  const router = useRouter();
  const timelineData = useTimelineData();

  const post = usePost();

  const info = useReferendumInfo();
  const onchainData = useOnchainData();
  const proposal = onchainData?.proposal ?? {};

  const { tabs, activeTabValue } = useMemo(() => {
    const tabs = [
      (proposal?.call || proposal.inline) && {
        value: "call",
        label: "Call",
        content: <Gov2ReferendumCall />,
      },

      {
        value: "metadata",
        label: "Metadata",
        content: (
          <Gov2ReferendumMetadata info={info} pallet="fellowshipReferenda" />
        ),
      },
      {
        value: "timeline",
        label: "Timeline",
        activeCount: timelineData?.length,
        content: (
          <div>
            <TimelineModeTabs />

            <Timeline trackInfo={post?.onchainData?.trackInfo} />
          </div>
        ),
      },
    ].filter(Boolean);
    const [defaultTab] = tabs;
    return { tabs, activeTabValue: router.query.tab || defaultTab.value };
  }, [
    info,
    post?.onchainData?.trackInfo,
    proposal?.call,
    proposal.inline,
    router.query.tab,
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
