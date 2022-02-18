const {
  rpc: bifrostRpc,
  signedExtensions: bifrostSignedExtensions,
  types: bifrostTypes,
  typesAlias: bifrostTypeAlias,
  typesBundle: bifrostTypesBundle,
} = require("@bifrost-finance/types");

const options = {
  rpc: {
    ...bifrostRpc,
  },
  types: {
    ...bifrostTypes,
  },
  typesAlias: {
    ...bifrostTypeAlias,
  },
  typesBundle: {
    spec: {
      ...bifrostTypesBundle,
    },
  },
  signedExtensions: {
    ...bifrostSignedExtensions,
  },
};

module.exports = {
  bifrostOptions: options,
};
