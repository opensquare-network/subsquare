import dayjs from "dayjs";
import Tooltip from "next-common/components/tooltip";

function formatDateTime(time) {
  return dayjs(time).format("YYYY-MM-DD HH:mm:ss");
}

function formatDate(time) {
  return dayjs(time).format("YYYY-MM-DD");
}

function formatBlockHeight(height) {
  return "#" + height.toLocaleString();
}

export function FellowshipSalaryTimeRange({ cycle = {} }) {
  const { indexer = {}, endIndexer = {} } = cycle || {};

  return (
    <Tooltip
      className="text-textTertiary"
      content={
        <div>
          <div className="text12Bold">
            {formatBlockHeight(indexer.blockHeight)} -{" "}
            {formatBlockHeight(endIndexer.blockHeight)}
          </div>

          <div className="text12Medium">
            Start Time: {formatDateTime(indexer.blockTime)}
          </div>

          <div className="text12Medium">
            End Time: {formatDateTime(endIndexer.blockTime)}
          </div>
        </div>
      }
    >
      {formatDate(indexer.blockTime)} - {formatDate(endIndexer.blockTime)}
    </Tooltip>
  );
}

export function FellowshipSalaryTimeBlock({ indexer = {} }) {
  return (
    <div className="max-sm:text-right">
      <div>{formatDateTime(indexer.blockTime)}</div>
      <div className="text12Medium text-textSecondary">
        {formatBlockHeight(indexer.blockHeight)}
      </div>
    </div>
  );
}
