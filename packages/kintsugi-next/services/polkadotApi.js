import { ApiPromise, WsProvider } from "@polkadot/api";
import interbtc from "@interlay/interbtc-types";

const apiInstanceMap = new Map();

export const getApi = async (chain, queryUrl) => {
  if (!apiInstanceMap.has(queryUrl)) {
    const provider = new WsProvider(queryUrl, 1000);
    const options = {
      provider,
      typesBundle: {
        spec: {
          "interbtc-parachain": interbtc,
        },
      },
      rpc: interbtc.rpc,
    };

    apiInstanceMap.set(queryUrl, ApiPromise.create(options));
  }
  return apiInstanceMap.get(queryUrl);
};
