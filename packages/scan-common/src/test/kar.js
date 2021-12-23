const { setChain, CHAINS } = require("../env");
const { setProvider, setApi } = require("../chain/api");
const { karuraEndpoint } = require("./constants");
const { typesBundleForPolkadot } = require("@acala-network/type-definitions");
const { ApiPromise, WsProvider } = require("@polkadot/api");

async function setKarura() {
  const provider = new WsProvider(karuraEndpoint, 1000);
  const api = await ApiPromise.create({
    provider,
    typesBundle: { ...typesBundleForPolkadot },
  });

  setProvider(provider);
  setApi(api);
  setChain(CHAINS.KARURA);
}

module.exports = {
  setKarura,
};
