const { ApiPromise, WsProvider } = require("@polkadot/api");
const { currentChain, CHAINS } = require("./env");
const { typesBundleForPolkadot } = require("@acala-network/type-definitions");

let provider = null;
let api = null;

const defaultKaruraEndPoint = "wss://karura.kusama.elara.patract.io";
const defaultKusamaEndpoint = "wss://kusama.elara.patract.io";
const defaultPolkadotEndpoint = "wss://polkadot.elara.patract.io/";

async function getApi() {
  if (!api) {
    const chain = currentChain();

    let wsEndpoint = process.env.KAR_WS_ENDPOINT || defaultKaruraEndPoint;
    if (chain === CHAINS.KARURA) {
      wsEndpoint = process.env.KAR_WS_ENDPOINT || defaultKaruraEndPoint;
    } else if (chain === CHAINS.KUSAMA) {
      wsEndpoint = process.env.KSM_WS_ENDPOINT || defaultKusamaEndpoint;
    } else if (chain === CHAINS.POLKADOT) {
      wsEndpoint = process.env.DOT_WS_ENDPOINT || defaultPolkadotEndpoint;
    }

    console.log(`Connect to endpoint:`, wsEndpoint);

    provider = new WsProvider(wsEndpoint);
    const options = { provider };
    if (chain === CHAINS.KARURA) {
      options.typesBundle = { ...typesBundleForPolkadot };
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
