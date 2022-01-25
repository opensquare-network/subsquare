const lib = require("@interlay/interbtc-types");

const definitions = lib.default;

function parseProviderRpcDefinitions(rpcDefs) {
  const parsedDefs = {};
  for (const module in rpcDefs) {
    const definitions = rpcDefs[module];
    for (const definitionName in definitions) {
      const definitionBody = definitions[definitionName];
      const decoratedDefinitionBody = {
        ...definitionBody,
        aliasSection: module,
      };
      parsedDefs[definitionName] = decoratedDefinitionBody;
    }
  }
  return parsedDefs;
}

module.exports = {
  types: definitions.types[0].types,
  rpc: parseProviderRpcDefinitions(definitions.rpc),
  providerRpc: definitions.rpc,
};
