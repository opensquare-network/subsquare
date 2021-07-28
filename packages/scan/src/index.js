require("dotenv").config();

const { disconnect } = require("./api");
const { updateHeight, getLatestHeight } = require("./chain");
const { getNextScanHeight, updateScanHeight } = require("./mongo/scanHeight");
const { sleep } = require("./utils/sleep");
const { getBlocks } = require("./mongo/meta");
const { getRegistryByHeight } = require("./utils/registry");
const { isHex } = require("./utils");
const { GenericBlock } = require("@polkadot/types");
const { hexToU8a } = require("@polkadot/util");
const { logger } = require("./logger");

let registry;

async function main() {
  await updateHeight();
  let scanHeight = await getNextScanHeight();

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
    if (scanHeight + 100 < chainHeight) {
      targetHeight = scanHeight + 100;
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
        scanHeight = block.height + 1;
      } catch (e) {
        logger.error(`Error with block scan ${block.height}`, e);
        await sleep(3000);
      }
    }

    await sleep(1);
  }
}

async function handleOneBlockDataInDb(blockInDb) {
  if (!registry || registry.specVersion.toNumber() !== blockInDb.specVersion) {
    registry = await getRegistryByHeight(blockInDb.height);
  }

  let block;
  if (isHex(blockInDb.block)) {
    block = new GenericBlock(registry.registry, hexToU8a(blockInDb.block));
  } else {
    block = new GenericBlock(registry.registry, blockInDb.block.block);
  }

  const blockEvents = registry.registry.createType(
    "Vec<EventRecord>",
    blockInDb.events,
    true
  );
  const author =
    blockInDb.author &&
    registry.registry.createType("AccountId", blockInDb.author, true);

  // handle the business
}

main()
  .then(() => console.log("Scan finished"))
  .catch(console.error)
  .finally(cleanUp);

async function cleanUp() {
  await disconnect();
}
