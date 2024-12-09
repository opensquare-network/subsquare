import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(duration);
dayjs.extend(relativeTime);

export function formatTimeDuration(
  input,
  {
    slice = 2,
    withUnitSpace = false,
    showMonths = true,
    showSeconds = true,
  } = {},
) {
  if (input === 0) {
    return "0";
  }

  const duration = dayjs.duration(input);

  let yr = duration.years();
  let mo = duration.months();
  let d = duration.days();
  const hr = duration.hours();
  const min = duration.minutes();
  const s = duration.seconds();

  if (!showMonths) {
    const yearAsDays = dayjs.duration({ years: yr }).asDays();
    const monthAsDays = dayjs.duration({ months: mo }).asDays();
    d += yearAsDays + monthAsDays;
    yr = 0;
    mo = 0;
  }

  if (yr < 1 && mo < 1 && d < 3) {
    slice = Math.max(slice, 2);
  }

  const result = [
    buildTimeUnit(yr, "yr", { withUnitSpace }),
    buildTimeUnit(mo, "mo", { withUnitSpace }),
    buildTimeUnit(d, "d", { withUnitSpace, withPluralSuffix: false }),
    buildTimeUnit(hr, "hr", { withUnitSpace }),
    buildTimeUnit(min, "min", { withUnitSpace }),
    showSeconds
      ? buildTimeUnit(s, "s", { withUnitSpace, withPluralSuffix: false })
      : null,
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
