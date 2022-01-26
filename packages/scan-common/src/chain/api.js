const definitions = require("./kintsugi/definitions");
const { ApiPromise, WsProvider } = require("@polkadot/api");
const { CHAINS, currentChain } = require("../env");
const { typesBundleForPolkadot } = require("@acala-network/type-definitions");
const { versionedKhala, typesChain } = require("@phala/typedefs");
const { basilisk } = require("./bundle/basilisk");
const {
  typesBundleForPolkadot: bifrostTypesBundleForPolkadot,
  rpc,
} = require("@bifrost-finance/type-definitions");

let provider = null;
let api = null;

async function getApi() {
  if (api) {
    return api;
  }

  const wsEndpoint = process.env.WS_ENDPOINT;
  if (!wsEndpoint) {
    throw new Error("WS_ENDPOINT not set");
  }

  provider = new WsProvider(wsEndpoint, 1000);
  const chain = currentChain();
  const options = { provider };
  if (chain === CHAINS.KARURA) {
    options.typesBundle = { ...typesBundleForPolkadot };
  } else if (chain === CHAINS.KHALA) {
    options.typesBundle = {
      spec: {
        khala: versionedKhala,
      },
    };
    options.typesChain = typesChain;
  } else if (chain === CHAINS.BASILISK) {
    options.typesBundle = { spec: { basilisk } };
  } else if (CHAINS.KINTSUGI === chain) {
    options.typesBundle = {
      spec: {
        "interbtc-parachain": definitions,
      },
    };
    options.rpc = definitions.providerRpc;
  } else if (CHAINS.BIFROST === chain) {
    options.typesBundle = {
      spec: {
        bifrost: bifrostTypesBundleForPolkadot.spec.bifrost,
        "bifrost-parachain": bifrostTypesBundleForPolkadot.spec.bifrost,
      },
      rpc,
    };
  }

  api = await ApiPromise.create(options);
  console.log(`Connected to endpoint:`, wsEndpoint);
  return api;
}

async function disconnect() {
  if (provider) {
    provider.disconnect();
  }
}

// For test
function setApi(targetApi) {
  api = targetApi;
}

// for test
function setProvider(p) {
  provider = p;
}

// for test
function getProvider() {
  return provider;
}

module.exports = {
  getApi,
  disconnect,
  setApi,
  getProvider,
  setProvider,
};
