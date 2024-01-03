import isNil from "lodash.isnil";

export default function Percentage({ perbill = 0 }) {
  if (isNil(perbill) || perbill <= 0) {
    return "0.0%";
  }

  const precision = perbill > 10 * Math.pow(10, 7) ? 1 : 2;
  return ((perbill / Math.pow(10, 9)) * 100).toFixed(precision) + "%";
}
