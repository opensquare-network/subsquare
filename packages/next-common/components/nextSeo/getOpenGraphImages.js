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
