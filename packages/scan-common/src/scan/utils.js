const { getMetaScanHeight, updateSpecs } = require("../chain/specs");
const { getScanStep, isUseMetaDb: isUseMeta } = require("../env");
const { getChainLatestHeight } = require("../chain/height");

function getHeights(start, end) {
  const heights = [];
  for (let i = start; i <= end; i++) {
    heights.push(i);
  }

  return heights;
}

function getTargetHeight(startHeight) {
  const chainHeight = getChainLatestHeight();

  let targetHeight = chainHeight;
  const step = getScanStep();
  if (startHeight + step < chainHeight) {
    targetHeight = startHeight + step;
  }

  return targetHeight;
}

async function checkAndUpdateSpecs(targetHeight) {
  if (!isUseMeta()) {
    return;
  }

  if (targetHeight > getMetaScanHeight()) {
    await updateSpecs();
  }
}

module.exports = {
  getHeights,
  getTargetHeight,
  checkAndUpdateSpecs,
};
