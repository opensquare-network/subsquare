const { onFinalityKusama } = require("./constants");
const { setChain, CHAINS } = require("../env");
const { setProvider, setApi } = require("../chain/api");
const { ApiPromise, WsProvider } = require("@polkadot/api");

async function setKusama() {
  const provider = new WsProvider(onFinalityKusama, 1000);
  const api = await ApiPromise.create({ provider });
  setProvider(provider);
  setApi(api);
  setChain(CHAINS.KUSAMA);
}

module.exports = {
  setKusama,
};
