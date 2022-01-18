const { isKarura } = require("../../../../env");
const { hexToString } = require("@polkadot/util");

const balanceTypes = ["Balance", "Compact<BalanceOf>", "Compact<Balance>"];

function normalizeKaruraArg(type, name, value) {
  if (
    type === "ModuleAssetRegistryModuleAssetMetadata" &&
    name === "metadata"
  ) {
    const rawJSON = value.toJSON();
    rawJSON.name = hexToString(value.name.toHex());
    rawJSON.symbol = hexToString(value.symbol.toHex());

    return rawJSON;
  }

  return value.toJSON();
}

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
