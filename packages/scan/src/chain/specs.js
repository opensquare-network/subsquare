const { getAllVersionChangeHeights } = require("../mongo/meta");
const { getApi } = require("../api");
const { isUseMetaDb } = require("../env");
const { logger } = require("../logger");

let versionChangedHeights = [];
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

async function findRegistry({ blockHeight, blockHash }) {
  const blockApi = await findBlockApi({ blockHeight, blockHash });
  return blockApi.registry;
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
