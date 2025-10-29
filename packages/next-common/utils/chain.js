import { blake2AsHex } from "@polkadot/util-crypto";
import Chains from "./consts/chains";
import getChainSettings from "./consts/settings";
import { u8aToHex } from "@polkadot/util";

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

export function isPolkadotPeopleChain(chain) {
  return [Chains.polkadotPeople].includes(chain);
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

export function isKusamaPeopleChain(chain) {
  return [Chains.kusamaPeople].includes(chain);
}

export function isWestendPeopleChain(chain) {
  return [Chains.westendPeople].includes(chain);
}

export function isKusamaChain(chain) {
  return [Chains.kusama].includes(chain);
}

export function isAssetHubChain(chain) {
  return [
    Chains.polkadotAssetHub,
    Chains.westendAssetHub,
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

export function isZkverifyChain(chain) {
  return [Chains.zkverifyTestnet].includes(chain);
}

export function isRelayChain(chain) {
  return [
    Chains.polkadot,
    Chains.kusama,
    Chains.westend,
    Chains.paseo,
  ].includes(chain);
}

export function isPeopleChain(chain) {
  return [
    Chains.polkadotPeople,
    Chains.kusamaPeople,
    Chains.paseoPeople,
    Chains.westendPeople,
  ].includes(chain);
}

export function isPaseoChain(chain) {
  return [Chains.paseo].includes(chain);
}

export function isPaseoAssetHubChain(chain) {
  return [Chains.paseoAssetHub].includes(chain);
}

export function isPaseoPeopleChain(chain) {
  return [Chains.paseoPeople].includes(chain);
}

export function isLaosChain(chain) {
  return [Chains.laos].includes(chain);
}

export function isHyperBridgeChain(chain) {
  return [Chains.hyperBridge].includes(chain);
}

export function isCoretimeChain(chain) {
  return [Chains.kusamaCoretime, Chains.polkadotCoretime].includes(chain);
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
  } else if (isPolkadotPeopleChain(chain)) {
    return Chains.polkadot;
  } else if (isKusamaPeopleChain(chain)) {
    return Chains.kusama;
  } else if (isPaseoPeopleChain(chain)) {
    return Chains.paseo;
  } else if (isWestendPeopleChain(chain)) {
    return Chains.westend;
  } else if (isHyperBridgeChain(chain)) {
    return Chains.polkadot;
  }

  throw new Error("Unsupported relay chain");
}

export function chainApiHash(...args) {
  const { chainApi: { hasher } = {} } = getChainSettings(
    process.env.NEXT_PUBLIC_CHAIN,
  );
  if (hasher) {
    const hash = hasher(...args);
    return u8aToHex(hash);
  }
  return blake2AsHex(...args);
}
