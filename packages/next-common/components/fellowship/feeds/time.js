import dayjs from "dayjs";
import Duration from "next-common/components/duration";

export default function FellowshipFeedTime({ indexer, className = "" }) {
  const blockTime = indexer?.blockTime;
  const day = dayjs(blockTime);

  let content;

  if (day.isBefore(dayjs().subtract(1, "year"))) {
    content = day.format("YYYY-MM-DD HH:mm:ss");
  } else {
    content = <Duration time={blockTime} />;
  }

  return <span className={className}>{content}</span>;
}
