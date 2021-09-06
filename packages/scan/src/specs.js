const { getAllVersionChangeHeights } = require("./mongo/meta");
const { getRegistryByHeight } = require("./utils/registry");
const findLast = require("lodash.findlast");
const { expandMetadata } = require("@polkadot/types");
const { getMetadataByHeight } = require("./utils/registry");

let versionChangedHeights = [];
let registryMap = {};
let metadataMap = {};
let decoratedMap = {};

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

async function findDecorated(height) {
  const mostRecentChangeHeight = findLast(
    versionChangedHeights,
    (h) => h <= height
  );
  if (!mostRecentChangeHeight) {
    throw new Error(`Can not find height ${height}`);
  }

  let decorated = decoratedMap[mostRecentChangeHeight];
  if (!decorated) {
    const metadata = await getMetadataByHeight(height);
    decorated = expandMetadata(metadata.registry, metadata);
    decoratedMap[height] = decorated;
  }

  return decorated;
}

module.exports = {
  updateSpecs,
  getSpecHeights,
  findRegistry,
  findMetadata,
  findDecorated,
  setSpecHeights,
};
