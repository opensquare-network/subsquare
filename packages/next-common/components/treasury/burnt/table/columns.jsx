import dayjs from "dayjs";
import ExplorerLink from "next-common/components/links/explorerLink";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import BlockHeight from "next-common/components/identityTimeline/timeline/blockHeight";
import { useChainSettings } from "next-common/context/chain";
import { SystemDate } from "@osn/icons/subsquare";

function TimeCell({ item }) {
  const { indexer } = item || {};
  return (
    <div className="flex flex-col gap-[4px]">
      <div className="text-textTertiary">
        {dayjs(indexer?.blockTime).format("YYYY-MM-DD HH:mm:ss")}
      </div>
      <ExplorerLink indexer={indexer} className="hover:underline">
        <BlockHeight
          number={indexer?.blockHeight}
          contentClassName="hover:underline"
        />
      </ExplorerLink>
    </div>
  );
}

function EventIdCell({ item }) {
  const indexer = item?.indexer || {};
  const label = `${indexer?.blockHeight}-${indexer?.eventIndex}`;

  return (
    <div className="inline-flex items-center gap-x-1">
      <SystemDate className="w-4 h-4 text-textDisabled [&_path]:stroke-2" />
      <ExplorerLink indexer={indexer}>
        <span className="text14Medium hover:underline text-textPrimary">
          {label}
        </span>
      </ExplorerLink>
    </div>
  );
}

function AmountCell({ value, decimals, symbol }) {
  return (
    <ValueDisplay value={toPrecision(value || 0, decimals)} symbol={symbol} />
  );
}

function ValueCell({ item }) {
  const { decimals, symbol } = useChainSettings();

  return (
    <AmountCell value={item?.balance} decimals={decimals} symbol={symbol} />
  );
}

function PercentCell({ item }) {
  return (
    <span className="text14Medium text-textPrimary">
      {item?.burnPercent || "-"}
    </span>
  );
}

function RemnantCell({ item }) {
  const { decimals, symbol } = useChainSettings();
  return (
    <AmountCell
      value={item?.treasuryBalance}
      decimals={decimals}
      symbol={symbol}
    />
  );
}

export const desktopColumns = [
  {
    name: "Time",
    className: "min-w-[200px] text-left",
    render: (item) => <TimeCell item={item} />,
  },
  {
    name: "Event ID",
    className: "min-w-[160px] text-left",
    render: (item) => <EventIdCell item={item} />,
  },
  {
    name: "Value",
    className: "min-w-[160px] text-right",
    render: (item) => <ValueCell item={item} />,
  },
  {
    name: "Per",
    className: "min-w-[80px] text-right",
    render: (item) => <PercentCell item={item} />,
  },
  {
    name: "Remnant",
    className: "min-w-[160px] text-right",
    render: (item) => <RemnantCell item={item} />,
  },
];

export const mobileColumns = [
  {
    name: "Time",
    className: "text-left",
    render: (item) => <TimeCell item={item} />,
  },
  {
    name: "Event ID",
    className: "text-left",
    render: (item) => <EventIdCell item={item} />,
  },
  {
    name: "Value",
    className: "text-right",
    render: (item) => <ValueCell item={item} />,
  },
  {
    name: "Per",
    className: "text-right",
    render: (item) => <PercentCell item={item} />,
  },
  {
    name: "Remnant",
    className: "text-right",
    render: (item) => <RemnantCell item={item} />,
  },
];
