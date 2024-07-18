import Chains from "./consts/chains";

export async function getBlockHeightFromHash(api, blockHash) {
  const header = await api.rpc.chain.getHeader(blockHash);
  const targetHeight = header.number.toNumber();
  return targetHeight;
}

export function isCollectivesChain(chain) {
  return [Chains.collectives, Chains.westendCollectives].includes(chain);
}

export function isCentrifugeChain(chain) {
  return Chains.centrifuge === chain;
}

export function isKintsugiChain(chain) {
  return [Chains.kintsugi, Chains.interlay].includes(chain);
}

export function isAssetHubChain(chain) {
  return [Chains.polkadotAssetHub].includes(chain);
}
