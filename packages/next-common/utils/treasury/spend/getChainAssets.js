import Chains from "next-common/utils/consts/chains";

const { KnownKusamaAssetHubAssets } = require("./knownKusamaAssetHubAssets");
const {
  KnownPolkadotAssetHubAssets,
} = require("./knownPolkadotAssetHubAssets");

export function getChainAssets() {
  const chain = process.env.NEXT_PUBLIC_CHAIN;
  if (chain === Chains.kusama) {
    return KnownKusamaAssetHubAssets;
  } else if (chain === Chains.polkadot) {
    return KnownPolkadotAssetHubAssets;
  } else {
    return [];
  }
}
