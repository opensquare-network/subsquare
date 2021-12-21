const { handleEvents } = require("../business/event");
const { handleExtrinsics } = require("../business/extrinsic");
const {
  chain: { removeBlockApi },
  utils: { getBlockIndexer },
} = require("@subsquare/scan-common");

async function scanNormalizedBlock(block, blockEvents) {
  // handle the business
  const blockIndexer = getBlockIndexer(block);
  await handleExtrinsics(block.extrinsics, blockEvents, blockIndexer);
  await handleEvents(blockEvents, block.extrinsics, blockIndexer);

  removeBlockApi(blockIndexer.blockHash);
}

module.exports = {
  scanNormalizedBlock,
};
