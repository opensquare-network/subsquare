import dayjs from "dayjs";
import Tooltip from "next-common/components/tooltip";

function formatBlockHeight(height) {
  return "#" + height.toLocaleString();
}

export default function FellowshipSalaryTimeRange({ cycle = {} }) {
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
            Start Time: {dayjs(indexer.blockTime).format("YYYY-MM-DD HH:mm:ss")}
          </div>

          <div className="text12Medium">
            End Time:{" "}
            {dayjs(endIndexer.blockTime).format("YYYY-MM-DD HH:mm:ss")}
          </div>
        </div>
      }
    >
      {dayjs(indexer.blockTime).format("YYYY-MM-DD")} -{" "}
      {dayjs(endIndexer.blockTime).format("YYYY-MM-DD")}
    </Tooltip>
  );
}
