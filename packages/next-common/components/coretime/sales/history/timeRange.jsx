import dayjs from "dayjs";
import Tooltip from "next-common/components/tooltip";
import ExplorerLink from "next-common/components/links/explorerLink";

function formatDateTime(time) {
  return dayjs(time).format("YYYY-MM-DD HH:mm:ss");
}

function formatDate(time) {
  return dayjs(time).format("YYYY-MM-DD");
}

function formatBlockHeight(height) {
  return "#" + height?.toLocaleString();
}

function TimeRangeLink({ indexer }) {
  return (
    <div className="inline hover:underline">
      <ExplorerLink indexer={indexer} style={{ display: "inline" }}>
        {formatDate(indexer?.blockTime)}
      </ExplorerLink>
    </div>
  );
}

export function CoretimeSalesHistoryTimeRange({ data = {} }) {
  const { initIndexer = {}, endIndexer = {} } = data;

  return (
    <Tooltip
      className="text-textTertiary"
      content={
        <div>
          <div className="text12Bold">
            {formatBlockHeight(initIndexer.blockHeight)}
            {" - "}
            {formatBlockHeight(endIndexer?.blockHeight)}
          </div>

          <div className="text12Medium">
            Start Time: {formatDateTime(initIndexer.blockTime)}
          </div>

          <div className="text12Medium">
            End Time: {formatDateTime(endIndexer?.blockTime)}
          </div>
        </div>
      }
    >
      <TimeRangeLink indexer={initIndexer} />
      {" - "}
      <TimeRangeLink indexer={endIndexer} />
    </Tooltip>
  );
}

export function CoretimeSalesHistoryTimeBlock({ indexer = {} }) {
  return (
    <div className="max-sm:text-right">
      <TimeRangeLink indexer={indexer} />
      <div className="text12Medium text-textSecondary">
        {formatBlockHeight(indexer?.blockHeight)}
      </div>
    </div>
  );
}
