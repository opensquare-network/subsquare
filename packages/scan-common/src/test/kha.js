const { khalaEndpoint } = require("./constants");
const { setChain, CHAINS } = require("../env");
const { setProvider, setApi } = require("../chain/api");
const { versionedKhala, typesChain } = require("@phala/typedefs");
const { ApiPromise, WsProvider } = require("@polkadot/api");

async function setKhala() {
  const provider = new WsProvider(khalaEndpoint, 1000);
  const options = {
    typesBundle: {
      spec: {
        khala: versionedKhala,
      },
    },
    typesChain,
    provider,
  };

  const api = await ApiPromise.create(options);
  setProvider(provider);
  setApi(api);
  setChain(CHAINS.KHALA);
}

module.exports = {
  setKhala,
};
