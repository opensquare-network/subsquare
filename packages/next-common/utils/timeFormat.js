function formatPlural(num, unit) {
  if (num === 1) {
    return `${num}${unit}`;
  }
  return `${num}${unit}s`;
}

export function formatHours(num) {
  return formatPlural(num, "h");
}

export function formatDays(num) {
  return formatPlural(num, "day");
}
