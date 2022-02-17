import definitions from "@interlay/interbtc-types";

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

export default {
  types: definitions.types[0].types,
  rpc: parseProviderRpcDefinitions(definitions.rpc),
  providerRpc: definitions.rpc,
};
