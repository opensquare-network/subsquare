const definitions = require("./kintsugi/definitions");
const { getKintRegistry } = require("./kintsugi/registry");
import { ApiPromise, WsProvider } from "@polkadot/api";

const apiInstanceMap = new Map();

export const getApi = async (chain, queryUrl) => {
  if (!apiInstanceMap.has(queryUrl)) {
    const provider = new WsProvider(queryUrl, 1000);
    const options = { provider };
    if (chain === "kintsugi") {
      options.registry = getKintRegistry();
      options.rpc = definitions.providerRpc;
    }

    apiInstanceMap.set(queryUrl, ApiPromise.create(options));
  }
  return apiInstanceMap.get(queryUrl);
};
