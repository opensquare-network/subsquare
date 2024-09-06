import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(duration);
dayjs.extend(relativeTime);

export function formatTimeDuration(
  input,
  { slice = 2, withUnitSpace = false, showMonths = true } = {},
) {
  let duration = dayjs.duration(input);

  let yr = duration.years();
  let mo = duration.months();
  let d = duration.days();
  let hr = duration.hours();
  let min = duration.minutes();
  let s = duration.seconds();

  if (!showMonths) {
    const yearAsDays = dayjs.duration({ years: yr }).asDays();
    const monthAsDays = dayjs.duration({ months: mo }).asDays();
    d += yearAsDays + monthAsDays;
    yr = 0;
    mo = 0;
  }

  const result = [
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

  return result;
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
