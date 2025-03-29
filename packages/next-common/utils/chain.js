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
  return [Chains.westendAssetHub, Chains.westendAssetHubNext].includes(chain);
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
    Chains.westendAssetHubNext,
    Chains.kusamaAssetHub,
    Chains.paseoAssetHub,
  ].includes(chain);
}

export function isAjunaChain(chain) {
  return [Chains.ajuna].includes(chain);
}

export function isShibuyaChain(chain) {
  return [Chains.shibuya, Chains.astar].includes(chain);
}

export function isPolkadotChain(chain) {
  return [Chains.polkadot].includes(chain);
}

export function isRelayChain(chain) {
  return [
    Chains.polkadot,
    Chains.kusama,
    Chains.westend,
    Chains.paseo,
  ].includes(chain);
}

export function isPaseoChain(chain) {
  return [Chains.paseo].includes(chain);
}

export function isPaseoAssetHubChain(chain) {
  return [Chains.paseoAssetHub].includes(chain);
}

export function isLaosChain(chain) {
  return [Chains.laos].includes(chain);
}

export function getAssetHubChain(chain) {
  if (isAssetHubChain(chain)) {
    return chain;
  } else if (isPolkadotChain(chain)) {
    return Chains.polkadotAssetHub;
  } else if (isKusamaChain(chain)) {
    return Chains.kusamaAssetHub;
  } else if (isWestendChain(chain)) {
    return Chains.westendAssetHub;
  } else if (isPaseoChain(chain)) {
    return Chains.paseoAssetHub;
  }

  const relayChain = getRelayChain(chain);
  if (relayChain === chain) {
    throw new Error("Unsupported asset hub chain");
  }

  return getAssetHubChain(relayChain);
}

export function getRelayChain(chain) {
  if (isRelayChain(chain)) {
    return chain;
  } else if (isPolkadotAssetHubChain(chain)) {
    return Chains.polkadot;
  } else if (isKusamaAssetHubChain(chain)) {
    return Chains.kusama;
  } else if (isWestendAssetHubChain(chain)) {
    return Chains.westend;
  } else if (isPaseoAssetHubChain(chain)) {
    return Chains.paseo;
  } else if (isCollectivesChain(chain)) {
    return Chains.polkadot;
  }

  throw new Error("Unsupported relay chain");
}
