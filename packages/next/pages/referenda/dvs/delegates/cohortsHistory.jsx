import { NeutralPanel } from "next-common/components/styled/containers/neutralPanel";
import DataList from "next-common/components/dataList";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import Tag from "next-common/components/tags/state/tag";
import SecondaryButton from "next-common/lib/button/secondary";
import { ArrowRight } from "@osn/icons/subsquare";
import Pagination from "next-common/components/pagination";
import { defaultPageSize } from "next-common/utils/constants";
import WindowSizeProvider from "next-common/context/windowSize";
import { useIsMobile } from "next-common/components/overview/accountInfo/components/accountBalances";
import Descriptions from "next-common/components/Descriptions";

const columns = [
  {
    name: "Index",
    style: { width: 80, textAlign: "left" },
  },
  {
    name: "Tenure",
  },
  {
    name: "Delegates",
    style: { width: 120, textAlign: "right" },
  },
  {
    name: "W3F Delegation",
    style: { width: 160, textAlign: "right" },
  },
  {
    name: "Participation",
    style: { width: 120, textAlign: "right" },
  },
  {
    name: "Status",
    style: { width: 120, textAlign: "right" },
  },
  {
    name: "",
    style: { width: 80, textAlign: "right" },
  },
];

export function CohortsHistoryImpl({ dataRows = [] }) {
  const isMobile = useIsMobile();
  if (isMobile) {
    return <MobileList />;
  }

  return <DesktopList dataRows={dataRows} />;
}

export default function CohortsHistory() {
  return (
    <WindowSizeProvider>
      <NeutralPanel className="p-6">
        <CohortsHistoryImpl dataRows={[{}]} />
        <Pagination total={1} pageSize={defaultPageSize} current={1} />
      </NeutralPanel>
    </WindowSizeProvider>
  );
}

function DesktopList({ dataRows = [] }) {
  const chainSettings = useChainSettings();
  const symbol = chainSettings.voteSymbol || chainSettings.symbol;

  const rows = dataRows.map((row, index) => [
    <span key="index">{index + 1}</span>,
    <span key="tenure" className="text-textTertiary">
      2025-04-15 - 2025-08-15
    </span>,
    <span key="delegates">6</span>,
    <ValueDisplay key="w3fDelegation" value={100} symbol={symbol} />,
    <ValueDisplay key="participation" value={100} />,
    <Tag key="status" state="active">
      Active
    </Tag>,
    <DetailAction key="action" />,
  ]);
  return (
    <DataList
      columns={columns}
      rows={rows}
      noDataText="No cohorts history"
      bordered={false}
    />
  );
}

function MobileList() {
  const chainSettings = useChainSettings();
  const symbol = chainSettings.voteSymbol || chainSettings.symbol;

  return (
    <div>
      <div className="mb-3">
        <div className="flex grow items-center justify-between">
          1
          <DetailAction />
        </div>
      </div>

      <Descriptions
        bordered={false}
        className="[&_.descriptions-item-label]:text-textTertiary [&_.descriptions-item]:h-auto [&_.descriptions-item]:my-2"
        items={[
          {
            label: "Start Time",
            value: (
              <TimeValue time="2025-04-15 13:56:24" blockNumber="123456" />
            ),
            className: "items-start",
          },
          {
            label: "End Time",
            value: (
              <TimeValue time="2025-08-15 13:56:24" blockNumber="123456" />
            ),
            className: "items-start",
          },
          {
            label: "Delegates",
            value: "6",
          },
          {
            label: "W3F Delegation",
            value: (
              <ValueDisplay key="w3fDelegation" value={100} symbol={symbol} />
            ),
          },
          {
            label: "Participation",
            value: <ValueDisplay key="participation" value={100} />,
          },
          {
            label: "Status",
            value: (
              <Tag key="status" state="active">
                Active
              </Tag>
            ),
          },
        ]}
      />
    </div>
  );
}

function DetailAction() {
  return (
    <SecondaryButton key="action" size="icon" className="p-0 w-7 h-7">
      <ArrowRight />
    </SecondaryButton>
  );
}

function TimeValue({ time, blockNumber }) {
  return (
    <div className="flex flex-col gap-y-1 justify-end items-end">
      <span className="text-textPrimary">{time}</span>
      <span className="text-textSecondary">#{blockNumber}</span>
    </div>
  );
}
