const { getAllVersionChangeHeights } = require("../mongo/meta");
const findLast = require("lodash.findlast");
const { getApi } = require("../api");
const { isUseMetaDb } = require("../env");
const { logger } = require("../logger");

let versionChangedHeights = [];
let registryMap = {};
let apiMap = {};
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
    const api = await getApi();
    const blockHash = await api.rpc.chain.getBlockHash(height);
    registry = (await api.getBlockRegistry(blockHash)).registry;
    registryMap[mostRecentChangeHeight] = registry;
  }

  return registry;
}

async function findBlockApiByHeight(blockHeight) {
  const mostRecentChangeHeight = findRecentHeight(blockHeight);

  let targetApi = apiMap[mostRecentChangeHeight];
  if (!targetApi) {
    const api = await getApi();
    const blockHash = await api.rpc.chain.getBlockHash(mostRecentChangeHeight);
    targetApi = await api.at(blockHash);
    apiMap[mostRecentChangeHeight] = targetApi;
  }

  return targetApi;
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
