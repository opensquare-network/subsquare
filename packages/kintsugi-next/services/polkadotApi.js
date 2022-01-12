import { ApiPromise, WsProvider } from "@polkadot/api";

const apiInstanceMap = new Map();

export const getApi = async (chain, queryUrl) => {
  if (!apiInstanceMap.has(queryUrl)) {
    const provider = new WsProvider(queryUrl, 1000);
    const options = { provider };
    if (chain === "kintsugi") {
      //TODO: kintsugi type boundle
      //options.typesBundle = ...;
    }

    apiInstanceMap.set(queryUrl, ApiPromise.create(options));
  }
  return apiInstanceMap.get(queryUrl);
};
