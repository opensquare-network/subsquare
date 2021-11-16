require("dotenv").config();

const { updateSpecs, getMetaScanHeight } = require("./chain/specs");
const { disconnect } = require("./api");
const { updateHeight, getLatestHeight } = require("./chain");
const { getNextScanHeight, updateScanHeight } = require("./mongo/scanHeight");
const { sleep } = require("./utils/sleep");
const { logger } = require("./logger");
const { scanKnownHeights } = require("./scan/known");
const { doScanKnownFirst } = require("./env");
const { isUseMetaDb } = require("./env");
const { fetchBlocks } = require("./service/fetchBlocks");
const { scanNormalizedBlock } = require("./scan/block");

const scanStep = parseInt(process.env.SCAN_STEP) || 100;

async function main() {
  await updateHeight();
  let scanHeight = await getNextScanHeight();
  await updateSpecs(scanHeight);

  if (doScanKnownFirst()) {
    await scanKnownHeights();
  }

  scanHeight = await getNextScanHeight();
  while (true) {
    // chainHeight is the current on-chain last block height
    const chainHeight = getLatestHeight();

    if (scanHeight > chainHeight) {
      // Just wait if the to scan height greater than current chain height
      await sleep(1000);
      continue;
    }

    let targetHeight = chainHeight;
    if (scanHeight + scanStep < chainHeight) {
      targetHeight = scanHeight + scanStep;
    }

    if (isUseMetaDb()) {
      if (targetHeight > getMetaScanHeight()) {
        await updateSpecs();
      }
    }

    const heights = [];
    for (let i = scanHeight; i <= targetHeight; i++) {
      heights.push(i);
    }

    const blocks = await fetchBlocks(heights);
    if ((blocks || []).length <= 0) {
      await sleep(1000);
      continue;
    }

    for (const block of blocks) {
      // TODO: transactional
      try {
        await scanNormalizedBlock(block.block, block.events);
        await updateScanHeight(block.height);
        logger.debug(`${block.height} done`);

        if (block.height % 80000 === 0) {
          process.exit(0);
        }
      } catch (e) {
        logger.error(`Error with block scan ${block.height}`, e);
        await sleep(3000);
      }
    }

    const startHeight = blocks[0].height;
    const destHeight = blocks[(blocks || []).length - 1].height;
    logger.info(`blocks ${startHeight}-${destHeight} done`);

    scanHeight = destHeight + 1;
    await sleep(1);
  }
}

main()
  .then(() => console.log("Scan finished"))
  .catch(console.error)
  .finally(cleanUp);

async function cleanUp() {
  await disconnect();
}
