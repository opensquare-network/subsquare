import Chains from "next-common/utils/consts/chains";

const CHAIN_COVER_FILENAMES_MAP = {
  [Chains.hydradx]: {
    large: "hydration.jpg",
    small: "hydration-small.jpg",
  },
};

function resolveCoversRepoFilepathUrl(filename) {
  return `https://cdn.jsdelivr.net/gh/opensquare-network/subsquare-static/covers/${filename}`;
}

export function getOpenGraphImages(chainValue) {
  const coverFilenames = CHAIN_COVER_FILENAMES_MAP[chainValue];
  if (coverFilenames) {
    return {
      large: resolveCoversRepoFilepathUrl(coverFilenames.large),
      small: resolveCoversRepoFilepathUrl(coverFilenames.small),
    };
  }

  return {
    large: resolveCoversRepoFilepathUrl(`${chainValue}.jpg`),
    small: resolveCoversRepoFilepathUrl(`${chainValue}-small.jpg`),
  };
}
