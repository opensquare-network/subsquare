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

export function isPolkadotAssetHubChain(chain) {
  return [Chains.polkadotAssetHub].includes(chain);
}

export function isWestendAssetHubChain(chain) {
  return [Chains.westendAssetHub].includes(chain);
}

export function isWestendChain(chain) {
  return [Chains.westend].includes(chain);
}

export function isKusamaAssetHubChain(chain) {
  return [Chains.kusamaAssetHub].includes(chain);
}

export function isKusamaChain(chain) {
  return [Chains.kusama].includes(chain);
}

export function isAssetHubChain(chain) {
  return [
    Chains.polkadotAssetHub,
    Chains.westendAssetHub,
    Chains.kusamaAssetHub,
  ].includes(chain);
}

export function isShibuyaChain(chain) {
  return [Chains.shibuya, Chains.astar].includes(chain);
}

export function isPolkadotChain(chain) {
  return [Chains.polkadot].includes(chain);
}
