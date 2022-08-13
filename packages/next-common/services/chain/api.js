import { ApiPromise, WsProvider } from "@polkadot/api";
import Chains from "../../utils/consts/chains";
import {
  bifrostOptions,
  karuraOptions,
  polkadexOptions,
  crustOptions,
  khalaOptions,
  kintsugiOptions,
  zeitgeistOptions,
} from "@osn/provider-options";
import crabOptions from "./crab";

const apiInstanceMap = new Map();

export default async function getApi(chain, endpoint) {
  if (!Object.keys(Chains).includes(chain)) {
    throw new Error(`Invalid chain: ${ chain } to construct api`);
  }

  if (!apiInstanceMap.has(endpoint)) {
    const provider = new WsProvider(endpoint, 1000);
    let options = { provider };

    let customizedOptions = {};
    if ([Chains.karura, Chains.acala].includes(chain)) {
      customizedOptions = karuraOptions;
    } else if ([Chains.khala, Chains.phala].includes(chain)) {
      customizedOptions = khalaOptions;
    } else if (chain === "bifrost") {
      customizedOptions = bifrostOptions;
    } else if ([Chains.kintsugi, Chains.interlay].includes(chain)) {
      customizedOptions = kintsugiOptions;
    } else if (chain === Chains.polkadex) {
      customizedOptions = polkadexOptions;
    } else if (chain === Chains.crust) {
      customizedOptions = crustOptions;
    } else if (chain === Chains.crab) {
      customizedOptions = crabOptions;
    } else if (chain === Chains.zeitgeist) {
      customizedOptions = zeitgeistOptions;
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
