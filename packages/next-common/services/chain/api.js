import { ApiPromise, WsProvider } from "@polkadot/api";
import Chains from "../../utils/consts/chains";
import {
  altairOptions,
  bifrostOptions,
  karuraOptions,
  polkadexOptions,
  crustOptions,
  khalaOptions,
  zeitgeistOptions,
} from "@osn/provider-options";
import allOptions from "@osn/provider-options";
import crabOptions from "./crab";
import darwinia2Options from "./darwinia2";

const apiInstanceMap = new Map();

export default async function getApi(chain, endpoint) {
  if (!Object.keys(Chains).includes(chain)) {
    throw new Error(`Invalid chain: ${chain} to construct api`);
  }

  if (!apiInstanceMap.has(endpoint)) {
    const provider = new WsProvider(endpoint, 1000);
    let options = { provider };

    let customizedOptions;
    if ([Chains.karura, Chains.acala].includes(chain)) {
      customizedOptions = karuraOptions;
    } else if ([Chains.khala, Chains.phala].includes(chain)) {
      customizedOptions = khalaOptions;
    } else if (chain === Chains.bifrost) {
      customizedOptions = bifrostOptions;
    } else if (chain === Chains.polkadex) {
      customizedOptions = polkadexOptions;
    } else if (chain === Chains.crust) {
      customizedOptions = crustOptions;
    } else if (chain === Chains.crab) {
      customizedOptions = crabOptions;
    } else if (chain === Chains.zeitgeist) {
      customizedOptions = zeitgeistOptions;
    } else if (chain === Chains.altair) {
      customizedOptions = altairOptions;
    } else if (chain === Chains.darwinia2) {
      customizedOptions = darwinia2Options;
    } else {
      customizedOptions = allOptions[chain] || {};
    }

    const api = ApiPromise.create({
      ...customizedOptions,
      ...options,
    });

    apiInstanceMap.set(endpoint, api);
  }

  return await apiInstanceMap.get(endpoint);
}
