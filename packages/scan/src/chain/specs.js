const { getAllVersionChangeHeights } = require("../mongo/meta");
const findLast = require("lodash.findlast");
const { getRegistryByHeight } = require("./registry");
const { getApi } = require("../api");
const { isUseMetaDb } = require("../env");
const { logger } = require("../logger");

let versionChangedHeights = [];
let registryMap = {};
let blockApiMap = {};

async function updateSpecs(height) {
  if (isUseMetaDb()) {
    await updateSpecsFromMetaDb();
  } else {
    versionChangedHeights.splice(0, versionChangedHeights.length);
    versionChangedHeights.push(height);
  }
}

async function updateSpecsFromMetaDb() {
  versionChangedHeights = await getAllVersionChangeHeights();

  if (versionChangedHeights.length <= 0 || versionChangedHeights[0] > 1) {
    logger.error("No specHeights or invalid");
    process.exit(1);
  }
}

// For test
function setSpecHeights(heights = []) {
  versionChangedHeights = heights;
}

function getSpecHeights() {
  return versionChangedHeights;
}

async function findRegistry(height) {
  const mostRecentChangeHeight = findRecentHeight(height);

  let registry = registryMap[mostRecentChangeHeight];
  if (!registry) {
    registry = await getRegistryByHeight(mostRecentChangeHeight);
    registryMap[mostRecentChangeHeight] = registry;
  }

  return registry;
}

function findRecentHeight(blockHeight) {
  const mostRecentChangeHeight = findLast(
    versionChangedHeights,
    (h) => h <= blockHeight
  );
  if (!mostRecentChangeHeight) {
    throw new Error(`Can not find registry for height ${blockHeight}`);
  }

  return mostRecentChangeHeight;
}

async function findBlockApi({ blockHeight, blockHash }) {
  const maybe = blockApiMap[blockHash];
  if (maybe) {
    return maybe;
  }

  const api = await getApi();
  const blockApi = await api.at(blockHash);

  setBlockApi(blockHash, blockApi);
  return blockApi;
}

function setBlockApi(blockHash, api) {
  blockApiMap[blockHash] = api;
}

function removeBlockApi(blockHash) {
  delete blockApiMap[blockHash];
}

module.exports = {
  updateSpecs,
  getSpecHeights,
  findRegistry,
  setSpecHeights,
  findBlockApi,
  removeBlockApi,
};
