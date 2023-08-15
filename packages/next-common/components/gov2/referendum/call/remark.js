import { hexIsValidUTF8 } from "next-common/utils/utf8validate";
import { hexToString } from "@polkadot/util";

function isRemark(section, method) {
  return "system" === section && ["remark", "remarkWithEvent"].includes(method);
}

function findRemarkCalls(call) {
  const { section, method, args } = call;
  if (isRemark(section, method)) {
    return [call];
  }

  if ("utility" === section && ["batch", "forceBatch"].includes(method)) {
    const calls = args[0].value;
    return calls.filter((call) => isRemark(call.section, call.method));
  }

  return [];
}

export default function extractRemarks(call = {}) {
  const remarkCalls = findRemarkCalls(call);
  const remarks = [];
  for (const call of remarkCalls) {
    const value = call.args[0].value;
    if (hexIsValidUTF8(value)) {
      remarks.push(hexToString(value));
    }
  }

  return remarks;
}
