import { Item } from "../../common";
import {
  formatDate,
  formatDateTime,
} from "next-common/components/coretime/sales/history/timeRange";
import Tooltip from "next-common/components/tooltip";

export default function StartAt({ indexer }) {
  const { blockTime, blockHeight } = indexer;
  const startAt = formatDate(blockTime);
  const startTime = formatDateTime(blockTime);

  const content = `${blockHeight?.toLocaleString()}, ${startTime}`;

  return (
    <Tooltip content={content}>
      <Item
        label="Start at"
        value={startAt}
        valueClassName={"text-textSecondary"}
      />
    </Tooltip>
  );
}
