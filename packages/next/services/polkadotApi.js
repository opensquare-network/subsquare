import { ApiPromise, WsProvider } from "@polkadot/api";
import { typesBundleForPolkadot } from "@acala-network/type-definitions";

const apiInstanceMap = new Map();

export const getApi = async (chain, queryUrl) => {
  if (!apiInstanceMap.has(queryUrl)) {
    const provider = new WsProvider(queryUrl, 1000);
    const options = { provider };
    if (chain === "karura") {
      options.typesBundle = { ...typesBundleForPolkadot };
    }

    apiInstanceMap.set(queryUrl, ApiPromise.create(options));
  }
  return apiInstanceMap.get(queryUrl);
};
