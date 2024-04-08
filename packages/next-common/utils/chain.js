import Chains from "./consts/chains";

export async function getBlockHeightFromHash(api, blockHash) {
  const block = await api.rpc.chain.getBlock(blockHash);
  const targetHeight = block.block.header.number.toNumber();
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
