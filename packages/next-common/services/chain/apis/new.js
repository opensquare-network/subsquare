import Chains from "next-common/utils/consts/chains";
import { ApiPromise, WsProvider } from "@polkadot/api";
import allOptions, {
  altairOptions,
  bifrostOptions,
  crustOptions,
  karuraOptions,
  khalaOptions,
  polkadexOptions,
  zeitgeistOptions,
} from "@osn/provider-options";
import crabOptions from "next-common/services/chain/crab";
import getMetadata from "next-common/services/chain/apis/metadata";

const apiMap = new Map();

async function getOptions(chain, endpoint) {
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
  } else {
    customizedOptions = allOptions[chain] || {};
  }

  const { id, metadata } = await getMetadata(provider);
  return {
    ...customizedOptions,
    ...options,
    metadata: { [id]: metadata },
  };
}

export default async function newApi(chain, endpoint) {
  if (!Object.keys(Chains).includes(chain)) {
    throw new Error(`Invalid chain: ${chain} to construct api`);
  }

  if (!apiMap.has(endpoint)) {
    const options = await getOptions(chain, endpoint);
    const api = new ApiPromise(options);
    apiMap.set(endpoint, api);
  }
  return apiMap.get(endpoint);
}

export function getApiMap() {
  return apiMap;
}
