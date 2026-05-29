import Tabs from "next-common/components/tabs";
import { NeutralPanel } from "../../styled/containers/neutralPanel";
import SalesHistoryPurchases from "./purchases";
import SalesHistoryRenewals from "./renewals";
import { useEffect, useMemo, useState } from "react";
import useCoretimeSaleIsInterlude from "next-common/context/coretime/hooks/useCoretimeSaleIsInterlude";
import useCoretimeSale from "next-common/context/coretime/sale/provider";
import { cn } from "next-common/utils";
import Timeline from "next-common/components/timeline";
import { usePageProps } from "next-common/context/page";
import formatTime from "next-common/utils/viewfuncs/formatDate";
import useCoretimeSaleEnd from "next-common/context/coretime/hooks/useCoretimeSaleEnd";
import useRelayChainBlockTime from "next-common/context/coretime/hooks/useRelayChainBlockTime";
import useIsCoretimeUseRCBlockNumber from "next-common/hooks/coretime/useIsCoretimeUseRCBlockNumber";
import { useSelector } from "react-redux";
import { blockTimeSelector } from "next-common/store/reducers/chainSlice";

function TabTitle({ active, children }) {
  return (
    <div
      role="button"
      className={cn(
        "text16Bold",
        active ? "text-textPrimary" : "text-textTertiary",
      )}
    >
      {children}
    </div>
  );
}

function getLeadinEndTime(interludeEndTime, leadinLength, blockTime) {
  if (
    !Number.isFinite(interludeEndTime) ||
    !Number.isFinite(leadinLength) ||
    !Number.isFinite(blockTime)
  ) {
    return null;
  }
  return interludeEndTime + leadinLength * blockTime;
}

function findTimelineItem(timeline = [], name) {
  return timeline.find((item) => item.name === name);
}

function makeTimelineItem(status, blockTime, indexer) {
  if (!Number.isFinite(blockTime) || blockTime > Date.now()) {
    return null;
  }

  return {
    time: formatTime(blockTime),
    indexer,
    status: {
      value: status,
    },
  };
}

function makeSaleTimelineData({
  sale,
  saleTimeline,
  endSale,
  blockTime,
  isUseRCBlockNumber,
}) {
  const { info = {}, initIndexer, relaySaleStartIndexer } = sale || {};
  const initialized = findTimelineItem(saleTimeline, "Initialized");
  const started = findTimelineItem(saleTimeline, "Started");

  const saleStartHeight = isUseRCBlockNumber
    ? relaySaleStartIndexer?.blockHeight || info.saleStart
    : info.saleStart;

  const saleStartTime =
    initialized?.indexer?.blockTime ?? initIndexer?.blockTime;
  const interludeEndTime =
    started?.indexer?.blockTime ?? relaySaleStartIndexer?.blockTime;
  const leadinEndTime = getLeadinEndTime(
    interludeEndTime,
    info.leadinLength,
    blockTime,
  );
  const saleEndTime =
    sale?.endIndexer?.blockTime ?? endSale?.indexer?.blockTime;

  const leadinEndIndexer =
    !isUseRCBlockNumber &&
    Number.isFinite(saleStartHeight) &&
    Number.isFinite(info.leadinLength) &&
    Number.isFinite(leadinEndTime)
      ? {
          blockHeight: saleStartHeight + info.leadinLength,
          blockTime: leadinEndTime,
        }
      : null;

  return [
    makeTimelineItem(
      "Sale Start",
      saleStartTime,
      initialized?.indexer ?? initIndexer,
    ),
    makeTimelineItem("Interlude End", interludeEndTime, null),
    makeTimelineItem("Leadin End", leadinEndTime, leadinEndIndexer),
    makeTimelineItem(
      "Sale End",
      saleEndTime,
      sale?.isFinal ? sale?.endIndexer : null,
    ),
  ].filter(Boolean);
}

function SalesHistoryList() {
  const sale = useCoretimeSale();
  const { isInterludePhase, isLoading } = useCoretimeSaleIsInterlude();
  const [activeTabValue, setActiveTabValue] = useState("");

  useEffect(() => {
    if (isLoading) {
      return;
    }

    setActiveTabValue(isInterludePhase ? "renewals" : "purchases");
  }, [isInterludePhase, isLoading]);

  const renewalsTabInfo = {
    value: "renewals",
    label: "Renewals",
    activeCount: sale?.renewalCount,
    content: <SalesHistoryRenewals />,
  };

  const purchasesTabInfo = {
    value: "purchases",
    label: "Purchases",
    activeCount: sale?.purchaseCount,
    content: <SalesHistoryPurchases />,
  };

  const tabs = isInterludePhase
    ? [renewalsTabInfo, purchasesTabInfo]
    : [purchasesTabInfo, renewalsTabInfo];

  return (
    <Tabs
      activeTabValue={activeTabValue}
      onTabClick={(tab) => {
        setActiveTabValue(tab.value);
      }}
      tabs={isLoading ? [] : tabs}
    />
  );
}

function SalesTimeline() {
  const sale = useCoretimeSale();
  const { coretimeSaleTimeline = [] } = usePageProps();
  const endSale = useCoretimeSaleEnd();
  const relayBlockTime = useRelayChainBlockTime();
  const coretimeBlockTime = useSelector(blockTimeSelector);
  const isUseRCBlockNumber = useIsCoretimeUseRCBlockNumber(sale?.id);
  const blockTime = isUseRCBlockNumber ? relayBlockTime : coretimeBlockTime;

  const timelineData = useMemo(
    () =>
      makeSaleTimelineData({
        sale,
        saleTimeline: coretimeSaleTimeline,
        endSale,
        blockTime,
        isUseRCBlockNumber,
      }),
    [coretimeSaleTimeline, sale, endSale, blockTime, isUseRCBlockNumber],
  );

  return <Timeline data={timelineData} />;
}

export default function CoretimeSalesHistorySection() {
  const [activeTabValue, setActiveTabValue] = useState("history");
  const tabs = [
    {
      value: "history",
      label({ active }) {
        return <TabTitle active={active}>History</TabTitle>;
      },
      content: (
        <NeutralPanel className="p-6">
          <SalesHistoryList />
        </NeutralPanel>
      ),
    },
    {
      value: "timeline",
      label({ active }) {
        return <TabTitle active={active}>Timeline</TabTitle>;
      },
      content: (
        <NeutralPanel className="p-6">
          <SalesTimeline />
        </NeutralPanel>
      ),
    },
  ];

  return (
    <Tabs
      activeTabValue={activeTabValue}
      onTabClick={(tab) => setActiveTabValue(tab.value)}
      tabs={tabs}
      tabsListDivider={false}
      tabsListClassName="px-6 mb-4"
      tabsContentClassName="mt-0"
    />
  );
}
