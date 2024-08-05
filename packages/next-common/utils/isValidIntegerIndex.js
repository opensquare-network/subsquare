import { isInteger } from "lodash-es";

export function isValidIntegerIndex(value) {
  if (value === "") {
    return false;
  }
  const numberValue = Number(value);
  if (numberValue < 0) {
    return false;
  }
  if (!isInteger(numberValue)) {
    return false;
  }
  return true;
}
