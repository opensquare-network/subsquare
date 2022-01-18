const { normalizeKhalaArg } = require("./khala");
const { normalizeKaruraArg } = require("./karura");
const { isKarura, isPhala } = require("../../../../env");

const balanceTypes = ["Balance", "Compact<BalanceOf>", "Compact<Balance>"];
const numTypes = ["Compact<u128>", "u128", "u64", "Compact<u64>"];

function normalizeArgValue(type, name, value) {
  if (balanceTypes.includes(type) || numTypes.includes(type)) {
    return value.toString();
  }

  if (isKarura()) {
    return normalizeKaruraArg(...arguments);
  } else if (isPhala()) {
    return normalizeKhalaArg(...arguments);
  }

  return value.toJSON();
}

module.exports = {
  normalizeArgValue,
};
