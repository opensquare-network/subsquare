const { TypeRegistry } = require("@polkadot/types");
const definitions = require("./definitions");

function getAPITypes() {
  return Object.values(definitions).reduce(
    (res, { types }) => ({ ...res, ...types }),
    {}
  );
}

function getKintRegistry() {
  const registry = new TypeRegistry();
  registry.register(getAPITypes());
  return registry;
}

module.exports = {
  getKintRegistry,
};
