const { onFinalityPolkadot } = require("./constants");
const { setChain, CHAINS } = require("../env");
const { setProvider, setApi } = require("../chain/api");
const { ApiPromise, WsProvider } = require("@polkadot/api");

async function setPolkadot() {
  const provider = new WsProvider(onFinalityPolkadot, 1000);
  const api = await ApiPromise.create({ provider });
  setProvider(provider);
  setApi(api);
  setChain(CHAINS.POLKADOT);
}

module.exports = {
  setPolkadot,
};
