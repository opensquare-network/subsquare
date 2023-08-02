import { u8aToHex } from "@polkadot/util";

export const balanceTypes = [
  "Balance",
  "BalanceOf",
  "Compact<BalanceOf>",
  "Compact<Balance>",
];

export const numTypes = ["Compact<u128>", "u128", "u64", "Compact<u64>"];

function normalizeArgValue(type, name, value) {
  if (balanceTypes.includes(type) || numTypes.includes(type)) {
    return value.toString();
  }

  return value.toJSON();
}

export default function normalizeCall(call) {
  const { section, method } = call;
  const callIndex = u8aToHex(call.callIndex);

  const args = [];
  for (let index = 0; index < call.args.length; index++) {
    const arg = call.args[index];

    const argMeta = call.meta.args[index];
    const name = argMeta.name.toString();
    const type = argMeta.type.toString();
    if (type === "Call" || type === "CallOf") {
      args.push({
        name,
        type,
        value: normalizeCall(arg),
      });
      continue;
    }

    if (type === "Vec<Call>" || type === "Vec<CallOf>") {
      args.push({
        name,
        type,
        value: arg.map(normalizeCall),
      });
      continue;
    }

    const value = normalizeArgValue(type, name, arg);
    args.push({
      name,
      type,
      value,
    });
  }

  return {
    callIndex,
    section,
    method,
    args,
  };
}
