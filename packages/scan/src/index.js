require("dotenv").config();

const { findRegistry, updateSpecs, getSpecHeights } = require("./specs");
const { disconnect } = require("./api");
const { updateHeight, getLatestHeight } = require("./chain");
const { getNextScanHeight, updateScanHeight } = require("./mongo/scanHeight");
const { sleep } = require("./utils/sleep");
const { getBlocks } = require("./mongo/meta");
const { isHex } = require("./utils");
const { GenericBlock } = require("@polkadot/types");
const { hexToU8a } = require("@polkadot/util");
const { logger } = require("./logger");
const last = require("lodash.last");
const { scanNormalizedBlock } = require("./scan/block");

const scanStep = parseInt(process.env.SCAN_STEP) || 100;

async function main() {
  await updateHeight();
  let scanHeight = await getNextScanHeight();
  await updateSpecs();
  const specHeights = getSpecHeights();
  if (specHeights.length <= 0 || specHeights[0] > 1) {
    logger.error("No specHeights or invalid");
    return;
  }

  while (true) {
    // chainHeight is the current on-chain last block height
    const chainHeight = getLatestHeight();

    if (scanHeight > chainHeight) {
      // Just wait if the to scan height greater than current chain height
      await sleep(1000);
      continue;
    }

    let targetHeight = chainHeight;
    // Retrieve & Scan no more than 100 blocks at a time
    if (scanHeight + scanStep < chainHeight) {
      targetHeight = scanHeight + scanStep;
    }

    const specHeights = getSpecHeights();
    if (targetHeight > last(specHeights)) {
      await updateSpecs();
    }

    const blocks = await getBlocks(scanHeight, targetHeight);
    if ((blocks || []).length <= 0) {
      await sleep(1000);
      continue;
    }

    for (const block of blocks) {
      // TODO: transactional
      try {
        await handleOneBlockDataInDb(block);
        await updateScanHeight(block.height);
        logger.debug(`${block.height} done`);

        if (block.height % 20000 === 0) {
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

async function handleOneBlockDataInDb(blockInDb) {
  const registry = await findRegistry(blockInDb.height);

  let block;
  if (isHex(blockInDb.block)) {
    block = new GenericBlock(registry, hexToU8a(blockInDb.block));
  } else {
    block = new GenericBlock(registry, blockInDb.block.block);
  }

  const blockEvents = registry.createType(
    "Vec<EventRecord>",
    blockInDb.events,
    true
  );

  await scanNormalizedBlock(registry, block, blockEvents);
}

main()
  .then(() => console.log("Scan finished"))
  .catch(console.error)
  .finally(cleanUp);

async function cleanUp() {
  await disconnect();
}
