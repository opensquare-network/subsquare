const findLast = require("lodash.findlast");
const { getAllVersionChangeHeights, getScanHeight } = require("../mongo/meta");
const { getApi } = require("../api");
const { isUseMetaDb } = require("../env");
const { hexToU8a, isHex } = require("@polkadot/util");

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

  let u8aHash = blockHash;
  if (isHex(blockHash)) {
    u8aHash = hexToU8a(u8aHash);
  }

  return (await api.getBlockRegistry(u8aHash, spec.runtimeVersion)).registry;
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
