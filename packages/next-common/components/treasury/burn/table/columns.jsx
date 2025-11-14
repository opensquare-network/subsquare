import dayjs from "dayjs";
import ExplorerLink from "next-common/components/links/explorerLink";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import BlockHeight from "next-common/components/identityTimeline/timeline/blockHeight";
import { useChainSettings } from "next-common/context/chain";

function TimeCell({ item }) {
  const { indexer } = item || {};
  return (
    <div className="flex flex-col gap-[4px]">
      <div className="text-textPrimary">
        {dayjs(indexer?.blockTime).format("YYYY-MM-DD HH:mm:ss")}
      </div>
      <ExplorerLink indexer={indexer} className="hover:underline">
        <BlockHeight
          number={indexer?.blockHeight}
          contentClassName="hover:underline text-textDisabled"
        />
      </ExplorerLink>
    </div>
  );
}

function ValueCell({ item }) {
  const { decimals, symbol } = useChainSettings();
  return (
    <ValueDisplay
      value={toPrecision(item?.balance || 0, decimals)}
      symbol={symbol}
    />
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
    <ValueDisplay
      value={toPrecision(item?.treasuryBalance || 0, decimals)}
      symbol={symbol}
    />
  );
}

const columns = [
  {
    name: "Time",
    className: "min-w-[200px] text-left",
    render: (item) => <TimeCell item={item} />,
  },
  {
    name: "Value",
    className: "min-w-[160px] text-center",
    render: (item) => <ValueCell item={item} />,
  },
  {
    name: "Per",
    className: "min-w-[80px] text-center",
    render: (item) => <PercentCell item={item} />,
  },
  {
    name: "Remnant",
    className: "min-w-[160px] text-right",
    render: (item) => <RemnantCell item={item} />,
  },
];

export default columns;
