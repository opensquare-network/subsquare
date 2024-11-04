import { Item } from "../../common";
import { formatDate } from "next-common/components/coretime/sales/history/timeRange";

export default function StartAt({ startTime }) {
  const startAt = formatDate(startTime);

  return (
    <Item
      label="Start at"
      value={startAt}
      valueClassName={"text-textSecondary"}
    />
  );
}
