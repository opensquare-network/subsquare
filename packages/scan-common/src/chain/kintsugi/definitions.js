const lib = require("@interlay/interbtc-types");

const definitions = lib.default;

module.exports = {
  types: definitions.types[0].types,
  providerRpc: definitions.rpc,
};
