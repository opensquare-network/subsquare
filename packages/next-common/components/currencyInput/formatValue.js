export function formatValue(value = "") {
  if (value.startsWith(".")) {
    value = "0" + value;
  }

  const formatter = new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 20,
  });

  return formatter.format(value);
}
