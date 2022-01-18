const { handleExtrinsics } = require("../business/extrinsic");
const { handleEvents } = require("../business/event");
const {
  chain: { removeBlockApi },
  utils: { getBlockIndexer },
} = require("@subsquare/scan-common");

async function scanBlock(block, blockEvents) {
  const blockIndexer = getBlockIndexer(block);
  await handleExtrinsics(block.extrinsics, blockEvents, blockIndexer);
  await handleEvents(blockEvents, block.extrinsics, blockIndexer);

  removeBlockApi(blockIndexer.blockHash);
}

module.exports = {
  scanBlock,
};
