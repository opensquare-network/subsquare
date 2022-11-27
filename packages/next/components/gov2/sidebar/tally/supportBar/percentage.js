import isNil from "lodash.isnil";

export default function Percentage({ perbill = 0 }) {
  if (isNil(perbill)) {
    return "0.0%";
  }

  if (perbill > Math.pow(10, 7)) {
    return (perbill / Math.pow(10, 9)).toFixed(1) + "%";
  }

  return (perbill / Math.pow(10, 6)).toFixed(1) + "‰";
}
