const { getAllVersionChangeHeights } = require("./mongo/meta");
const findLast = require("lodash.findlast");
const { findRegistryByHash } = require("./chain/blockApi");
const { getApi } = require("./api");

let versionChangedHeights = [];
let registryMap = {};

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
    const api = await getApi();
    const blockHash = await api.rpc.chain.getBlockHash(mostRecentChangeHeight);
    registry = await findRegistryByHash(blockHash);
    registryMap[mostRecentChangeHeight] = registry;
  }

  return registry;
}

module.exports = {
  updateSpecs,
  getSpecHeights,
  findRegistry,
  setSpecHeights,
};
