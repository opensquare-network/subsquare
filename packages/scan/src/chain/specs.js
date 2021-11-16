const findLast = require("lodash.findlast");
const { getAllVersionChangeHeights, getScanHeight } = require("../mongo/meta");
const { getApi } = require("../api");
const { isUseMetaDb } = require("../env");
const { logger } = require("../logger");

let versionChangedHeights = [];
let blockApiMap = {};
let metaScanHeight = 1;

function getMetaScanHeight() {
  return metaScanHeight;
}

async function updateSpecs() {
  await updateSpecsFromMetaDb();
}

async function updateSpecsFromMetaDb() {
  versionChangedHeights = await getAllVersionChangeHeights();

  if (versionChangedHeights.length <= 0 || versionChangedHeights[0] > 1) {
    logger.error("No specHeights or invalid");
    process.exit(1);
  }

  metaScanHeight = await getScanHeight();
}

// For test
function setSpecHeights(heights = []) {
  versionChangedHeights = heights;
}

async function findRegistry({ blockHeight, blockHash }) {
  if (!isUseMetaDb()) {
    const blockApi = await findBlockApi({ blockHeight, blockHash });
    return blockApi.registry;
  }

  const spec = findMostRecentSpec(blockHeight);
  const api = await getApi();
  return (await api.getBlockRegistry(blockHash, spec.runtimeVersion)).registry;
}

function findMostRecentSpec(height) {
  const spec = findLast(versionChangedHeights, (h) => h.height <= height);
  if (!spec) {
    throw new Error(`Can not find height ${height}`);
  }

  return spec;
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
  findRegistry,
  setSpecHeights,
  findBlockApi,
  removeBlockApi,
  getMetaScanHeight,
};
