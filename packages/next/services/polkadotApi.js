import { ApiPromise, WsProvider } from "@polkadot/api";
import { typesBundleForPolkadot } from "@acala-network/type-definitions";
const { khala } = require("@phala/typedefs");
const { basilisk } = require("./bundle/basilisk");

const apiInstanceMap = new Map();

export const getApi = async (chain, queryUrl) => {
  if (!apiInstanceMap.has(queryUrl)) {
    const provider = new WsProvider(queryUrl, 1000);
    const options = { provider };
    if (chain === "karura" || chain === "acala") {
      options.typesBundle = { ...typesBundleForPolkadot };
    }
    if (chain === "khala") {
      options.types = khala;
    }
    if (chain === "basilisk") {
      options.typesBundle = { spec: { basilisk } };
    }

    apiInstanceMap.set(queryUrl, ApiPromise.create(options));
  }
  return apiInstanceMap.get(queryUrl);
};
