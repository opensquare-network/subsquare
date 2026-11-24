import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(duration);
dayjs.extend(relativeTime);

// Unit sizes used by dayjs duration internally.
const UNIT_MS = {
  yr: 365 * 24 * 60 * 60 * 1000,
  mo: 30 * 24 * 60 * 60 * 1000,
  d: 24 * 60 * 60 * 1000,
  hr: 60 * 60 * 1000,
  min: 60 * 1000,
  s: 1000,
};

// A trailing unit contributing less than this share of the total duration is
// rounding noise and can be hidden, e.g. "1 yr 6 hrs" => "1 yr".
const INSIGNIFICANT_SHARE = 0.02;

export function formatTimeDuration(
  input,
  {
    slice = 2,
    withUnitSpace = false,
    showMonths = true,
    showSeconds = true,
    dropInsignificant = false,
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

  let units = [
    { value: yr, unit: "yr" },
    { value: mo, unit: "mo" },
    { value: d, unit: "d" },
    { value: hr, unit: "hr" },
    { value: min, unit: "min" },
    showSeconds ? { value: s, unit: "s" } : null,
  ].filter((unit) => unit?.value > 0);

  if (dropInsignificant && units.length > 1) {
    const total = Math.abs(input);
    const dropFrom = units.findIndex(
      (unit, index) =>
        index > 0 &&
        (unit.value * UNIT_MS[unit.unit]) / total < INSIGNIFICANT_SHARE,
    );
    if (dropFrom > 0) {
      units = units.slice(0, dropFrom);
    }
  }

  const result = units
    .slice(0, slice)
    .map(({ value, unit }) =>
      buildTimeUnit(value, unit, {
        withUnitSpace,
        withPluralSuffix: !["d", "s"].includes(unit),
      }),
    )
    .filter(Boolean)
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
