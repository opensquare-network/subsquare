import dayjs from "dayjs";

export function formatTimeAgo(
  input,
  { futurePrefix = "in", pastSuffix = "ago" } = {},
) {
  const date = dayjs(input);

  if (!input || !date.isValid()) {
    return "unknown";
  }

  const now = dayjs();
  const diffInMinutes = Math.abs(now.diff(date, "minute"));
  if (Math.abs(diffInMinutes) < 1) {
    return "now";
  }

  const diffInHours = Math.abs(now.diff(date, "hour"));
  const diffInDays = Math.abs(now.diff(date, "day"));
  const diffInMonths = Math.abs(now.diff(date, "month"));
  const diffInYears = Math.abs(now.diff(date, "year"));
  const isFuture = now.isBefore(date);

  const formatted = getTimes(
    diffInYears,
    diffInMonths,
    diffInDays,
    diffInHours,
    diffInMinutes,
  );

  if (isFuture) {
    return `${futurePrefix} ${formatted}`;
  } else {
    return `${formatted} ${pastSuffix}`;
  }
}

function getTimes(years, months, days, hours, minutes) {
  if (years > 0) {
    return `${years}y`;
  }
  if (months > 0) {
    return `${months}mo`;
  }
  if (days > 0) {
    return `${days}d`;
  }
  if (hours > 0) {
    return `${hours}hr`;
  }
  return `${minutes}min`;
}
