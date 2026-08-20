import dayjs from "dayjs";
import Duration from "next-common/components/duration";

export default function TimeAge({
  isTime = false,
  time,
  timeFormat = "YYYY-MM-DD HH:mm:ss",
}) {
  if (!time) {
    return "-";
  }

  return isTime ? dayjs(time).format(timeFormat) : <Duration time={time} />;
}
