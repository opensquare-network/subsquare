const { handleEvents } = require("../business/event");
const { handleExtrinsics } = require("../business/extrinsic");
const { getBlockIndexer } = require("../utils/block/getBlockIndexer");

async function scanNormalizedBlock(block, blockEvents) {
  // handle the business
  const blockIndexer = getBlockIndexer(block);
  await handleExtrinsics(block.extrinsics, blockEvents, blockIndexer);
  await handleEvents(blockEvents, block.extrinsics, blockIndexer);
}

module.exports = {
  scanNormalizedBlock,
};
