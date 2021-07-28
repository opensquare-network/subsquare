const { ApiPromise, WsProvider } = require("@polkadot/api");
const { currentChain, CHAINS } = require("./env");

let provider = null;
let api = null;

const defaultKaruraEndPoint = "wss://karura.kusama.elara.patract.io";

async function getApi() {
  if (!api) {
    const chain = currentChain();

    let wsEndpoint = process.env.KAR_WS_ENDPOINT || defaultKaruraEndPoint;
    if (chain === CHAINS.KARURA) {
      wsEndpoint = process.env.KAR_WS_ENDPOINT || defaultKaruraEndPoint;
    }

    console.log(`Connect to endpoint:`, wsEndpoint);

    provider = new WsProvider(wsEndpoint);
    api = await ApiPromise.create({ provider });
  }

  return api;
}

async function disconnect() {
  if (provider) {
    provider.disconnect();
  }
}

module.exports = {
  getApi,
  disconnect,
};
