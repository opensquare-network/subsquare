const kintsugiDefinitions = require("./kintsugi/definitions");
const { ApiPromise, WsProvider } = require("@polkadot/api");
const { CHAINS, currentChain } = require("../env");
const { versionedKhala, typesChain } = require("@phala/typedefs");
const { basilisk } = require("./bundle/basilisk");
const { karuraOptions } = require("./karura/options");
const { bifrostOptions } = require("./bifrost/options");
const { definitions: polkadexDefinitions } = require("./polkadex/definitions");

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
  let options = { provider };
  if ([CHAINS.KARURA, CHAINS.ACALA].includes(chain)) {
    options = {
      ...karuraOptions,
      ...options,
    };
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
        "interbtc-parachain": kintsugiDefinitions,
      },
    };
    options.rpc = kintsugiDefinitions.providerRpc;
  } else if (CHAINS.BIFROST === chain) {
    options = {
      ...bifrostOptions,
      ...options,
    };
  } else if (CHAINS.POLKADEX === chain) {
    options.typesBundle = {
      spec: {
        "node-polkadex": polkadexDefinitions,
      },
    };
  }

  api = await ApiPromise.create(options);
  console.log(`Connected to endpoint:`, wsEndpoint);

  api.on("error", (err) => {
    console.error("api error, will restart:", err);
    process.exit(0);
  });
  api.on("disconnected", () => {
    console.error("api disconnected, will restart:");
    process.exit(0);
  });

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
