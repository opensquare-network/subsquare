import Chains from "next-common/utils/consts/chains";

const CHAIN_COVER_FILENAMES_MAP = {
  [Chains.hydradx]: {
    large: "hydration.jpg",
    small: "hydration-small.jpg",
  },
  [Chains.hydradxTestnet]: {
    large: "hydration.jpg",
    small: "hydration-small.jpg",
  },
  [Chains.zkverifyTestnet]: {
    large: "zkverify.jpg",
    small: "zkverify-small.jpg",
  },
  [Chains.kusamaAssetHub]: {
    large: "kusama-asset-hub.jpg",
    small: "kusama-asset-hub-small.jpg",
  },
  [Chains.westendAssetHub]: {
    large: "westend-asset-hub.jpg",
    small: "westend-asset-hub-small.jpg",
  },
  [Chains.westendAssetHubNext]: {
    //TODO:
    large: "westend-asset-hub.jpg",
    small: "westend-asset-hub-small.jpg",
  },
  [Chains.litentry]: {
    large: "heima.jpg",
    small: "heima-small.jpg",
  },
};

function resolveCoversRepoFilepathUrl(filename) {
  return `https://cdn.jsdelivr.net/gh/opensquare-network/subsquare-static/covers/${filename}`;
}

function getCoverFilenames(chainValue) {
  return (
    CHAIN_COVER_FILENAMES_MAP[chainValue] || {
      large: `${chainValue}.jpg`,
      small: `${chainValue}-small.jpg`,
    }
  );
}

export function getOpenGraphImages(chainValue) {
  const coverFilenames = getCoverFilenames(chainValue);

  return {
    large: resolveCoversRepoFilepathUrl(coverFilenames.large),
    small: resolveCoversRepoFilepathUrl(coverFilenames.small),
  };
}
