import dayjs from "dayjs";
import { timeDurationFromNow } from "next-common/utils";

export default function FellowshipFeedTime({ indexer, className = "" }) {
  const blockTime = indexer?.blockTime;
  const day = dayjs(blockTime);

  let content;

  if (day.isBefore(dayjs().subtract(1, "year"))) {
    content = day.format("YYYY-MM-DD HH:mm:ss");
  } else {
    content = timeDurationFromNow(blockTime);
  }

  return <span className={className}>{content}</span>;
}
