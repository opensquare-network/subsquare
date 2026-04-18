import Tabs from "next-common/components/tabs";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { useReferendumInfo } from "next-common/hooks/referenda/useReferendumInfo";
import { useOnchainData } from "next-common/context/post";
import ReferendumCallProvider from "next-common/context/referenda/call";
import dynamicClientOnly from "next-common/lib/dynamic/clientOnly";
import { useTimelineTabSwitch } from "next-common/hooks/useTabSwitch";
import { useReferendumTimelineData } from "next-common/hooks/pages/timelineData";
import tabsTooltipContentMap from "./tabsTooltipContentMap";
import { MigrationConditionalApiProvider } from "next-common/context/migration/conditionalApi";
import { MigrationConditionalPapiProvider } from "next-common/context/migration/conditionalPapi";
import { useChain, useChainSettings } from "next-common/context/chain";
import { isCollectivesChain } from "next-common/utils/chain";
import { PapiProvider } from "next-common/context/papi";
import PapiCallTreeProvider from "next-common/context/call/papiCallTree";

const Gov2ReferendumMetadata = dynamicClientOnly(() =>
  import("next-common/components/gov2/referendum/metadata"),
);

const Timeline = dynamicClientOnly(() =>
  import("next-common/components/timeline"),
);

const Gov2ReferendumCall = dynamicClientOnly(() =>
  import("next-common/components/gov2/referendum/call"),
);

const DetailCurveChart = dynamicClientOnly(() =>
  import(
    "next-common/components/charts/thresholdCurve/fellowshipCurveChart/detailCurveChart"
  ),
);

function LegacyReferendumCallTab({ indexer }) {
  return (
    <MigrationConditionalApiProvider indexer={indexer}>
      <ReferendumCallProvider>
        <Gov2ReferendumCall />
      </ReferendumCallProvider>
    </MigrationConditionalApiProvider>
  );
}

function PapiReferendumCallTab({ indexer }) {
  return (
    <PapiProvider>
      <MigrationConditionalPapiProvider indexer={indexer}>
        <PapiCallTreeProvider>
          <MigrationConditionalApiProvider indexer={indexer}>
            <ReferendumCallProvider>
              <Gov2ReferendumCall />
            </ReferendumCallProvider>
          </MigrationConditionalApiProvider>
        </PapiCallTreeProvider>
      </MigrationConditionalPapiProvider>
    </PapiProvider>
  );
}

export default function FellowshipReferendaDetailMultiTabs() {
  const chain = useChain();
  const { enablePapi } = useChainSettings();
  const isCollectives = isCollectivesChain(chain);
  const router = useRouter();
  const info = useReferendumInfo();
  const onchainData = useOnchainData();
  const proposal = onchainData?.proposal ?? {};

  const { component: timeLineTabSwitchComponent, isCompact } =
    useTimelineTabSwitch();
  const timelineData = useReferendumTimelineData();
  const indexer = onchainData?.indexer;
  const proposalIndexer = proposal?.indexer || onchainData?.indexer;
  const proposalCall = proposal?.call;
  const proposalInline = proposal?.inline;

  const { tabs, activeTabValue } = useMemo(() => {
    const tabs = [
      ...(proposalCall || proposalInline
        ? [
            {
              value: "call",
              label: "Call",
              tooltip: tabsTooltipContentMap.call,
              content: enablePapi ? (
                <PapiReferendumCallTab indexer={proposalIndexer} />
              ) : (
                <LegacyReferendumCallTab indexer={indexer} />
              ),
            },
          ]
        : []),
      {
        value: "metadata",
        label: "Metadata",
        tooltip: tabsTooltipContentMap.metadata,
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
            {timeLineTabSwitchComponent}
            <Timeline data={timelineData} compact={isCompact} />
          </div>
        ),
      },
      ...(isCollectives
        ? [
            {
              lazy: true,
              value: "curves",
              label: "Curves",
              content: <DetailCurveChart />,
            },
          ]
        : []),
    ];
    const [defaultTab] = tabs;
    return { tabs, activeTabValue: router.query.tab || defaultTab.value };
  }, [
    proposalCall,
    proposalInline,
    indexer,
    proposalIndexer,
    enablePapi,
    info,
    timelineData,
    timeLineTabSwitchComponent,
    isCompact,
    router,
    isCollectives,
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
