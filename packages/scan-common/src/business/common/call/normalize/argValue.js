const { normalizeKaruraArg } = require("./karura");
const { isKarura } = require("../../../../env");

const balanceTypes = ["Balance", "Compact<BalanceOf>", "Compact<Balance>"];

function normalizeArgValue(type, name, value) {
  if (balanceTypes.includes(type)) {
    return value.toString();
  }

  if (isKarura()) {
    return normalizeKaruraArg(...arguments);
  }

  return value.toJSON();
}

module.exports = {
  normalizeArgValue,
};
