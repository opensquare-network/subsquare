import Chains from "next-common/utils/consts/chains";
import getOptions from "next-common/services/chain/apis/options";

const apiMap = new Map();

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
