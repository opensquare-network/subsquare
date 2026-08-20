// Parachain data and lookup logic adapted from:
// https://github.com/kheopswap/kheopswap/blob/main/web/src/registry/parachains/parachains.json
// https://github.com/kheopswap/kheopswap/blob/main/web/src/registry/parachains/parachains.ts
// Attribution is kept here because `parachains.json` must remain valid JSON.
import parachains from "./parachains.json";
import Chains from "../consts/chains";
import Chainspolyfill from "../consts/settingsPolyfill/chainsPolyfill";

const PARACHAIN_CHAINS = {
  polkadot: {
    0: Chains.polkadot,
    1000: Chains.polkadotAssetHub,
    1001: Chains.collectives,
    1002: Chainspolyfill.polkadotBridge,
    1004: Chains.polkadotPeople,
    1005: Chains.polkadotCoretime,
    2004: Chains.moonbeam,
    2030: Chains.bifrostPolkadot,
    2032: Chains.interlay,
    2034: Chains.hydradx,
  },
  kusama: {
    0: Chains.kusama,
    1000: Chains.kusamaAssetHub,
    1001: Chains.collectives,
    1002: Chainspolyfill.kusamaBridge,
    1004: Chains.kusamaPeople,
    1005: Chains.kusamaCoretime,
    2004: Chains.khala,
    2023: Chains.moonriver,
  },
  paseo: {
    0: Chains.paseo,
    1000: Chains.paseoAssetHub,
    1004: Chains.paseoPeople,
  },
  westend: {
    0: Chains.westend,
    1000: Chains.westendAssetHub,
    1004: Chains.westendPeople,
  },
};

const RELAY_BY_CORETIME_CHAIN = {
  [Chains.polkadotCoretime]: "polkadot",
  [Chains.kusamaCoretime]: "kusama",
};

export function getParachainName(relay, paraId) {
  const parachain = parachains.find(
    (item) => item.relay === relay && item.paraId === Number(paraId),
  );

  return parachain?.name || `Parachain #${paraId}`;
}

export function getParachainChain(relay, paraId) {
  return PARACHAIN_CHAINS[relay]?.[Number(paraId)] || null;
}

export function getParachainChains(chain) {
  const relay = RELAY_BY_CORETIME_CHAIN[chain];
  return PARACHAIN_CHAINS[relay] || null;
}
