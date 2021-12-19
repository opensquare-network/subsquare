const { findBlockApi } = require("./blockApi");
const { getApi } = require("./api");
const { metaLogger, blockLogger } = require("../logger");
const { findRegistry } = require("./specs");
const { isUseMetaDb } = require("../env");
const { getBlocks } = require("../mongo/meta");
const { GenericBlock } = require("@polkadot/types");

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
  const registry = await findRegistry({
    blockHeight: blockInDb.height,
    blockHash: blockInDb.blockHash,
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
  const blocksInDb = await getBlocks(heights[0], heights[heights.length - 1]);

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
    allPromises.push(fetchOneBlockFromNode(height));
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
  const blockApi = await findBlockApi(blockHash);

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
