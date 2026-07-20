import Chains from "next-common/utils/consts/chains";
import { STATICS_CDN_URL } from "next-common/utils/consts/statics";

const CHAIN_COVER_FILENAMES_MAP = {
  [Chains.hydradx]: {
    large: "hydration.jpg",
  },
  [Chains.hydradxTestnet]: {
    large: "hydration.jpg",
  },
  [Chains.zkverifyTestnet]: {
    large: "zkverify.jpg",
  },
  [Chains.zkverify]: {
    large: "zkverify.jpg",
  },
  [Chains.kusamaAssetHub]: {
    large: "kusama-asset-hub.jpg",
  },
  [Chains.westendAssetHub]: {
    large: "westend-asset-hub.jpg",
  },
  [Chains.litentry]: {
    large: "heima.jpg",
  },
  [Chains.polkadot]: {
    large: "polkadot-v2.jpg",
  },
};

function resolveCoversRepoFilepathUrl(filename) {
  return `${STATICS_CDN_URL}/covers/${filename}`;
}

function getCoverFilenames(chainValue) {
  return (
    CHAIN_COVER_FILENAMES_MAP[chainValue] || {
      large: `${chainValue}.jpg`,
    }
  );
}

export function getOpenGraphImages(chainValue) {
  const coverFilenames = getCoverFilenames(chainValue);

  return {
    large: resolveCoversRepoFilepathUrl(coverFilenames.large),
  };
}
