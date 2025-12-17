import dayjs from "dayjs";
import { formatTimeDuration } from "./formatTimeDuration";

export function formatTimeAgo(
  targetTime,
  {
    referenceTime,
    futurePrefix = "in",
    pastSuffix = "ago",
    slice = 1,
    showSeconds = false,
  } = {},
) {
  const date = dayjs(targetTime);

  if (!targetTime || !date.isValid()) {
    return "unknown time";
  }

  const now = dayjs(referenceTime);

  const diffInSeconds = Math.abs(now.diff(date, "second"));
  if (diffInSeconds < 60) {
    return "now";
  }

  const isFuture = now.isBefore(date);

  const diffDuration = isFuture ? date.diff(now) : now.diff(date);
  const formatted = formatTimeDuration(diffDuration, {
    slice,
    showSeconds,
  });

  if (isFuture) {
    return `${futurePrefix} ${formatted}`;
  } else {
    return `${formatted} ${pastSuffix}`;
  }
}
