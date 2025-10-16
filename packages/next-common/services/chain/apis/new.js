import Chains from "next-common/utils/consts/chains";
import getOptions from "next-common/services/chain/apis/options";
import getChainSettings from "next-common/utils/consts/settings";

const apiMap = new Map();

function maybeSetHasher(chain, api) {
  const { chainApi: { hasher } = {} } = getChainSettings(chain);
  if (hasher) {
    api.registry.setHasher(hasher);
  }
}

async function newApiPromise(chain, endpoint) {
  const ApiPromise = (await import("@polkadot/api")).ApiPromise;

  const options = await getOptions(chain, endpoint);
  const api = new ApiPromise(options);
  maybeSetHasher(chain, api);
  return api;
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
