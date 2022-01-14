const { getNextScanHeight, updateScanHeight } = require("../mongo/scanHeight");
const {
  utils: { sleep },
  chain: {
    getChainLatestHeight,
    specs: { updateSpecs },
    fetchBlocks,
    clearBlockApi,
  },
  log: { logger },
  scan: { getHeights, getTargetHeight, checkAndUpdateSpecs },
} = require("@subsquare/scan-common");
const last = require("lodash.last");
const { scanBlock } = require("./block");
const { filterOutIgnoredHeights } = require("./ignore");

async function scan() {
  await updateSpecs();

  let scanHeight = await getNextScanHeight();
  while (true) {
    clearBlockApi();
    scanHeight = await oneStepScan(scanHeight);
  }
}

async function oneStepScan(startHeight) {
  const chainHeight = getChainLatestHeight();
  if (startHeight > chainHeight) {
    // Just wait if the to scan height greater than current chain height
    await sleep(3000);
    return startHeight;
  }

  const targetHeight = getTargetHeight(startHeight);
  await checkAndUpdateSpecs(targetHeight);

  let heights = getHeights(startHeight, targetHeight);
  heights = filterOutIgnoredHeights(heights);
  const blocks = await fetchBlocks(heights, false);
  if ((blocks || []).length <= 0) {
    await sleep(1000);
    return startHeight;
  }

  for (const item of blocks) {
    try {
      await scanBlock(item.block, item.events);
      await updateScanHeight(item.height);
    } catch (e) {
      await sleep(1000);
      logger.error(`Error with block scan ${item.height}`, e);
      console.error(`Error with block scan ${item.height}`, e);
    }

    if (item.height % 100000 === 0) {
      process.exit(0);
    }
  }

  const lastHeight = last(blocks || []).height;
  logger.info(`${startHeight} - ${lastHeight} done!`);
  return lastHeight + 1;
}

module.exports = {
  beginRoutineScan: scan,
};
