import { ApiPromise, WsProvider } from "@polkadot/api";
import Chains from "../../utils/consts/chains";
import {
  bifrostOptions,
  karuraOptions,
  polkadexOptions,
  crustOptions,
  khalaOptions,
  kintsugiOptions,
} from "@osn/provider-options";

const apiInstanceMap = new Map();

export default async function getApi(chain, endpoint) {
  if (!Object.keys(Chains).includes(chain)) {
    throw new Error(`Invalid chain: ${chain} to construct api`);
  }

  if (!apiInstanceMap.has(endpoint)) {
    const provider = new WsProvider(endpoint, 1000);
    let options = { provider };

    let customizedOptions = {};
    if (chain === "karura" || chain === "acala") {
      customizedOptions = karuraOptions;
    } else if (chain === "khala") {
      customizedOptions = khalaOptions;
    } else if (chain === "bifrost") {
      customizedOptions = bifrostOptions;
    } else if ([Chains.kintsugi, Chains.interlay].includes(chain)) {
      customizedOptions = kintsugiOptions;
    } else if (chain === Chains.polkadex) {
      customizedOptions = polkadexOptions;
    } else if (chain === Chains.crust) {
      customizedOptions = crustOptions;
    }

    const api = (
      await ApiPromise.create({
        ...customizedOptions,
        ...options,
      })
    ).isReady;

    apiInstanceMap.set(endpoint, api);
  }
  return apiInstanceMap.get(endpoint);
}
