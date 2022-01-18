const { u8aToHex } = require("@polkadot/util");
const { normalizeArgValue } = require("./argValue");

function normalizeCall(call) {
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

module.exports = {
  normalizeCall,
};
