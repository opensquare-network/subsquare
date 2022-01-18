const { hexToString } = require("@polkadot/util");

function handleChangeOptionRate(value) {
  if (value.isNoChange) {
    return value.toString();
  } else if (value.isNewValue) {
    const newValue = value.asNewValue;
    return {
      newValue: newValue.isSome ? newValue.toString() : null,
    };
  }
  return value.toJSON();
}

function handleChangeOptionRatio(value) {
  return handleChangeOptionRate(value);
}

function handleOrmlTraitsChangeOption(value) {
  return handleChangeOptionRate(value);
}

function handleChangeBalance(value) {
  if (value.isNoChange) {
    return value.toString();
  } else if (value.isNewValue) {
    return {
      newValue: value.asNewValue.toString(),
    };
  }
  return value.toJSON();
}

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

  if (type === "ChangeOptionRate") {
    return handleChangeOptionRate(value);
  } else if (type === "ChangeOptionRatio") {
    return handleChangeOptionRatio(value);
  } else if (type === "OrmlTraitsChangeOption") {
    return handleOrmlTraitsChangeOption(value);
  } else if (["ChangeBalance", "OrmlTraitsChangeU128"].includes(type)) {
    return handleChangeBalance(value);
  }

  return value.toJSON();
}

module.exports = {
  normalizeKaruraArg,
};
