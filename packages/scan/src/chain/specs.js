const { getAllVersionChangeHeights } = require("../mongo/meta");
const findLast = require("lodash.findlast");
const { getRegistryByHeight } = require("./registry");
const { isUseMetaDb } = require("../env");
const { logger } = require("../logger");

let versionChangedHeights = [];
let registryMap = {};

async function updateSpecs(height) {
  if (isUseMetaDb()) {
    await updateSpecsFromMetaDb();
  } else {
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

module.exports = {
  updateSpecs,
  getSpecHeights,
  findRegistry,
  setSpecHeights,
};
