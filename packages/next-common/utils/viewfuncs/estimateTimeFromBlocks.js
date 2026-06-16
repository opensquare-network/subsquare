import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

export function estimateTimeFromBlocks(blocks, blockTime = 6000) {
  if (!blocks || blocks <= 0) {
    return "0s";
  }

  const milliseconds = blocks * blockTime;
  const dur = dayjs.duration(milliseconds);

  const yrs = dur.years();
  const mos = dur.months();
  const d = dur.days();
  const hrs = dur.hours();
  const mins = dur.minutes();
  const secs = dur.seconds();

  const parts = [];
  if (yrs > 0) parts.push(`${yrs}yr`);
  if (mos > 0) parts.push(`${mos}mo`);
  if (d > 0) parts.push(`${d}d`);
  if (hrs > 0) parts.push(`${hrs}hr`);
  if (mins > 0) parts.push(`${mins}min`);
  if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);

  return parts.slice(0, 3).join(" ");
}
