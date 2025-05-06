import Chains from "next-common/utils/consts/chains";
import crabOptions from "next-common/services/chain/crab";
import getMetadata from "next-common/services/chain/apis/metadata";

const apiMap = new Map();

async function getOptions(chain, endpoint) {
  const WsProvider = (await import("@polkadot/api")).WsProvider;

  const provider = new WsProvider(endpoint, 1000);
  let options = { provider };

  const allOptions = (await import("@osn/provider-options")).default;

  let customizedOptions;
  if ([Chains.karura, Chains.acala].includes(chain)) {
    customizedOptions = allOptions.karuraOptions;
  } else if ([Chains.khala, Chains.phala].includes(chain)) {
    customizedOptions = allOptions.khalaOptions;
  } else if (chain === Chains.bifrost) {
    customizedOptions = allOptions.bifrostOptions;
  } else if (chain === Chains.polkadex) {
    customizedOptions = allOptions.polkadexOptions;
  } else if (chain === Chains.crust) {
    customizedOptions = allOptions.crustOptions;
  } else if (chain === Chains.crab) {
    customizedOptions = crabOptions;
  } else if (chain === Chains.zeitgeist) {
    customizedOptions = allOptions.zeitgeistOptions;
  } else if (chain === Chains.altair) {
    customizedOptions = allOptions.altairOptions;
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

async function newApiPromise(chain, endpoint) {
  const ApiPromise = (await import("@polkadot/api")).ApiPromise;

  const options = await getOptions(chain, endpoint);
  return new ApiPromise(options);
}

export default async function newApi(chain, endpoint) {
  if (!Object.values(Chains).includes(chain)) {
    throw new Error(`Invalid chain: ${chain} to construct api`);
  }

  if (!apiMap.has(endpoint)) {
    apiMap.set(endpoint, newApiPromise(chain, endpoint));
  }

  return await apiMap.get(endpoint);
}

export async function newOriginApi(chain, endpoint) {
  if (!Object.values(Chains).includes(chain)) {
    throw new Error(`Invalid chain: ${chain} to construct api`);
  }

  return await newApiPromise(chain, endpoint);
}

export function getApiMap() {
  return apiMap;
}
