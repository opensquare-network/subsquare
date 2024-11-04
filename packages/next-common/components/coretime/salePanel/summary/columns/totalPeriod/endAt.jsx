import { Item } from "../../common";
import {
  formatDate,
  formatDateTime,
} from "next-common/components/coretime/sales/history/timeRange";
import Tooltip from "next-common/components/tooltip";

export default function EndAt({ indexer }) {
  const { blockTime, blockHeight } = indexer;
  const endAt = formatDate(blockTime);
  const endTime = formatDateTime(blockTime);

  const content = `Estimated. ${blockHeight?.toLocaleString()}, ${endTime}`;

  return (
    <Tooltip content={content}>
      <Item
        label="End at"
        value={endAt}
        valueClassName={"text-textSecondary"}
      />
    </Tooltip>
  );
}
