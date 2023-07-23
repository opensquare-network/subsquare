import { hexIsValidUTF8 } from "next-common/utils/utf8validate";
import { hexToString } from "@polkadot/util";

export default function extractRemark(call = {}) {
  const { section, method, args } = call;
  if ("utility" !== section) {
    return null;
  }

  if (!["batch", "forceBatch"].includes(method)) {
    return null;
  }

  const calls = args[0].value;
  const remarkCall = calls.find(
    (call) => "system" === call.section && "remark" === call.method,
  );
  if (!remarkCall) {
    return null;
  }

  const value = remarkCall.args[0].value;
  if (hexIsValidUTF8(value)) {
    return hexToString(value);
  }
  return value;
}
