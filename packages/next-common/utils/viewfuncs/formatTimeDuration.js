import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(duration);
dayjs.extend(relativeTime);

export function formatTimeDuration(input) {
  const duration = dayjs.duration(input);

  const yr = duration.years();
  const mo = duration.months();
  const d = duration.days();
  const hr = duration.hours();
  const min = duration.minutes();
  const s = duration.seconds();

  let slice = 1;
  if (yr <= 0 && mo <= 0 && d < 3) {
    slice = 2;
  }

  return [
    yr > 0 ? `${yr}yr${yr > 1 ? "s" : ""}` : null,
    mo > 0 ? `${mo}mo${mo > 1 ? "s" : ""}` : null,
    d > 0 ? `${d}d` : null,
    hr > 0 ? `${hr}hr${hr > 1 ? "s" : ""}` : null,
    min > 0 ? `${min}min${min > 1 ? "s" : ""}` : null,
    s > 0 ? `${s}s` : null,
  ]
    .filter(Boolean)
    .slice(0, slice)
    .join(" ");
}
