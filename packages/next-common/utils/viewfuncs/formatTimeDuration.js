import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(duration);
dayjs.extend(relativeTime);

export function formatTimeDuration(
  input,
  { slice = 2, withUnitSpace = false } = {},
) {
  const duration = dayjs.duration(input);

  const yr = duration.years();
  const mo = duration.months();
  const d = duration.days();
  const hr = duration.hours();
  const min = duration.minutes();
  const s = duration.seconds();

  if (yr < 1 && mo < 1 && d < 3) {
    slice = Math.max(slice, 2);
  }

  return [
    buildTimeUnit(yr, "yr", { withUnitSpace }),
    buildTimeUnit(mo, "mo", { withUnitSpace }),
    buildTimeUnit(d, "d", { withUnitSpace, withPluralSuffix: false }),
    buildTimeUnit(hr, "hr", { withUnitSpace }),
    buildTimeUnit(min, "min", { withUnitSpace }),
    buildTimeUnit(s, "s", { withUnitSpace, withPluralSuffix: false }),
  ]
    .filter(Boolean)
    .slice(0, slice)
    .join(" ");
}

function buildTimeUnit(
  value,
  unit,
  { withPluralSuffix = true, withUnitSpace = false } = {},
) {
  if (value <= 0) {
    return null;
  }

  return `${value}${withUnitSpace ? " " : ""}${unit}${
    withPluralSuffix && value > 1 ? "s" : ""
  }`;
}
