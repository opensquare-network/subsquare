import { hexIsValidUTF8 } from "next-common/utils/utf8validate";
import { hexToString } from "@polkadot/util";

function findRemarkCall(call) {
  const { section, method, args } = call;
  if ("system" === section && "remark" === method) {
    return call;
  }

  if ("utility" === section && ["batch", "forceBatch"].includes(method)) {
    const calls = args[0].value;
    // todo: there maybe multiple remarks
    return calls.find(
      (call) => "system" === call.section && "remark" === call.method,
    );
  }

  return null;
}

export default function extractRemark(call = {}) {
  const remarkCall = findRemarkCall(call);
  if (!remarkCall) {
    return null;
  }

  const value = remarkCall.args[0].value;
  if (hexIsValidUTF8(value)) {
    return hexToString(value);
  }
  return value;
}
