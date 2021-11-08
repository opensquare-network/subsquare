const { findBlockApi } = require("../chain/specs");
const { isUseMetaDb } = require("../env");
const { getBlocksByHeights } = require("../mongo/meta");
const { findRegistry } = require("../chain/specs");
const { getApi } = require("../api");
const { GenericBlock } = require("@polkadot/types");
const { blockLogger, metaLogger } = require("../logger");

async function fetchBlocks(heights = []) {
  let blocks;
  if (isUseMetaDb()) {
    blocks = await fetchBlocksFromDb(heights);
  } else {
    blocks = await fetchBlocksFromNode(heights);
  }

  return blocks.filter((b) => b !== null);
}

async function constructBlockFromDbData(blockInDb) {
  const api = await getApi();
  let blockHash = blockInDb.blockHash;
  if (!blockHash) {
    blockHash = await api.rpc.chain.getBlockHash(blockInDb.height);
  }
  const registry = await findRegistry({
    blockHeight: blockInDb.height,
    blockHash,
  });
  const block = new GenericBlock(registry, blockInDb.block.block);
  const allEvents = registry.createType(
    "Vec<EventRecord>",
    blockInDb.events,
    true
  );

  return {
    height: blockInDb.height,
    block,
    events: allEvents,
  };
}

async function fetchBlocksFromDb(heights = []) {
  const blocksInDb = await getBlocksByHeights(heights);

  const blocks = [];
  for (const blockInDb of blocksInDb) {
    let block;
    try {
      block = await constructBlockFromDbData(blockInDb);
    } catch (e) {
      metaLogger.error(
        `can not construct block from db data at ${blockInDb.height}`,
        e
      );
      block = await makeSureFetch(blockInDb.height);
      metaLogger.info(`${blockInDb.height} fetch ok from node`);
    }

    blocks.push(block);
  }

  return blocks;
}

async function fetchBlocksFromNode(heights = []) {
  const allPromises = [];
  for (const height of heights) {
    allPromises.push(makeSureFetch(height));
  }

  return await Promise.all(allPromises);
}

async function makeSureFetch(height) {
  try {
    return await fetchOneBlockFromNode(height);
  } catch (e) {
    blockLogger.error(`error fetch block ${height}`, e);
    return null;
  }
}

async function fetchOneBlockFromNode(height) {
  const api = await getApi();
  const blockHash = await api.rpc.chain.getBlockHash(height);

  const blockApi = await findBlockApi({ blockHeight: height, blockHash });

  const promises = [
    api.rpc.chain.getBlock(blockHash),
    blockApi.query.system.events(),
  ];

  const [block, events] = await Promise.all(promises);

  return {
    height,
    block: block.block,
    events,
  };
}

module.exports = {
  fetchBlocks,
  fetchBlocksFromNode,
};
