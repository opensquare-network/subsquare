const { getAllVersionChangeHeights } = require("./mongo/meta");
const { getRegistryByHeight } = require("./utils/registry");
const findLast = require("lodash.findlast");
const { getMetadataByHeight } = require("./utils/registry");

let versionChangedHeights = [];
let registryMap = {};
let metadataMap = {};

async function updateSpecs() {
  versionChangedHeights = await getAllVersionChangeHeights();
}

// For test
function setSpecHeights(heights = []) {
  versionChangedHeights = heights;
}

function getSpecHeights() {
  return versionChangedHeights;
}

async function findRegistry(height) {
  const mostRecentChangeHeight = findLast(
    versionChangedHeights,
    (h) => h <= height
  );
  if (!mostRecentChangeHeight) {
    throw new Error(`Can not find registry for height ${height}`);
  }

  let registry = registryMap[mostRecentChangeHeight];
  if (!registry) {
    registry = await getRegistryByHeight(mostRecentChangeHeight);
    registryMap[mostRecentChangeHeight] = registry;
  }

  return registry;
}

async function findMetadata(height) {
  const mostRecentChangeHeight = findLast(
    versionChangedHeights,
    (h) => h <= height
  );
  if (!mostRecentChangeHeight) {
    throw new Error(`Can not find height ${height}`);
  }

  let metadata = metadataMap[mostRecentChangeHeight];
  if (!metadata) {
    metadata = await getMetadataByHeight(height);
    metadataMap[height] = metadata;
  }

  return metadata;
}

module.exports = {
  updateSpecs,
  getSpecHeights,
  findRegistry,
  findMetadata,
  setSpecHeights,
};
