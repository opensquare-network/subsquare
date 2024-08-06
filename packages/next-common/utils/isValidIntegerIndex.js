import { isInteger } from "lodash-es";

export function isValidIntegerIndex(value) {
  if (value === "") {
    return false;
  }
  const numberValue = Number(value);
  if (!isInteger(numberValue)) {
    return false;
  }
  if (numberValue < 0) {
    return false;
  }
  return true;
}
