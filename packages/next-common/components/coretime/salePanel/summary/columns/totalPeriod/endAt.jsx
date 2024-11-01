import { Item } from "../../common";
import { formatDate } from "next-common/components/coretime/sales/history/timeRange";

export default function EndAt({ endTime }) {
  const endAt = formatDate(endTime);

  return (
    <Item label="End At" value={endAt} valueClassName={"text-textSecondary"} />
  );
}
