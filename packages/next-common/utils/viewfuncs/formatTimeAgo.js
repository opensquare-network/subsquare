import dayjs from "dayjs";
import { formatTimeDuration } from "./formatTimeDuration";

export function formatTimeAgo(
  input,
  { futurePrefix = "in", pastSuffix = "ago", slice = 1 } = {},
) {
  const date = dayjs(input);

  if (!input || !date.isValid()) {
    return "unknown time";
  }

  const now = dayjs();

  const diffInSeconds = Math.abs(now.diff(date, "second"));
  if (diffInSeconds <= 10) {
    return "now";
  }

  const isFuture = now.isBefore(date);

  const diffDuration = isFuture ? date.diff(now) : now.diff(date);
  const formatted = formatTimeDuration(diffDuration, { slice });

  if (isFuture) {
    return `${futurePrefix} ${formatted}`;
  } else {
    return `${formatted} ${pastSuffix}`;
  }
}
