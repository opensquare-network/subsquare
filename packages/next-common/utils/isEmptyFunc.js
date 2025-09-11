import { noop } from "lodash-es";

export function isEmptyFunc(func) {
  return (func || noop) === noop;
}
