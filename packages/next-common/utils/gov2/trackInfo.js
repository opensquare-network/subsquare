import BigNumber from "bignumber.js";
import { isHex, hexToString } from "@polkadot/util";
import { trimEnd } from "lodash-es";

export function normalizeName(name) {
  let value = name;
  if (isHex(name)) {
    value = trimEnd(value, "0");
    value = hexToString(value);
  }

  const trimmed = trimEnd(value, "\x00");
  return (trimmed || "").toLowerCase().split(" ").join("_");
}

export function normalizeTrackInfo(track = {}) {
  return Object.entries(track).reduce((result, [name, value]) => {
    if (name === "decisionDeposit") {
      result[name] = new BigNumber(value).toString();
    } else if (name === "name") {
      result[name] = normalizeName(value || "");
      result.originalName = value;
    } else {
      result[name] = value;
    }

    return result;
  }, {});
}
