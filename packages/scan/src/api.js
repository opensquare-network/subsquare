const { ApiPromise, WsProvider } = require("@polkadot/api");
const { currentChain, CHAINS } = require("./env");
const { typesBundleForPolkadot } = require("@acala-network/type-definitions");
const { versionedKhala, typesChain } = require("@phala/typedefs");

let provider = null;
let api = null;

const defaultKaruraEndPoint = "wss://pub.elara.patract.io/karura";
const defaultKhalaEndpoint = "wss://khala.api.onfinality.io/public-ws";
const defaultKusamaEndpoint = "wss://pub.elara.patract.io/kusama";
const defaultPolkadotEndpoint = "wss://pub.elara.patract.io/polkadot";

async function getApi() {
  if (!api) {
    const chain = currentChain();

    let wsEndpoint = process.env.KAR_WS_ENDPOINT || defaultKaruraEndPoint;
    if (chain === CHAINS.KARURA) {
      wsEndpoint = process.env.KAR_WS_ENDPOINT || defaultKaruraEndPoint;
    } else if (chain === CHAINS.KHALA) {
      wsEndpoint = process.env.KHA_WS_ENDPOINT || defaultKhalaEndpoint;
    } else if (chain === CHAINS.KUSAMA) {
      wsEndpoint = process.env.KSM_WS_ENDPOINT || defaultKusamaEndpoint;
    } else if (chain === CHAINS.POLKADOT) {
      wsEndpoint = process.env.DOT_WS_ENDPOINT || defaultPolkadotEndpoint;
    }

    console.log(`Connect to endpoint:`, wsEndpoint);

    provider = new WsProvider(wsEndpoint, 1000);
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
    }

    api = await ApiPromise.create(options);
  }

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

module.exports = {
  getApi,
  disconnect,
  setApi,
};
