const { findBlockApi } = require("../../../chain/blockApi");
const { getApi } = require("../../../chain");

async function getCollectiveVoting(
  motionHash,
  indexer,
  moduleName = "council"
) {
  const blockApi = await findBlockApi(indexer.blockHash);
  if (!blockApi.query[moduleName]) {
    throw new Error(
      `voting query: can not get collective module ${moduleName} at ${indexer.blockHeight}`
    );
  }

  const raw = await blockApi.query[moduleName].voting(motionHash);
  return raw.toJSON();
}

async function getCollectiveVotingByHeight(
  motionHash,
  blockHeight,
  moduleName = "council"
) {
  const api = await getApi();
  const blockHash = await api.rpc.chain.getBlockHash(blockHeight);
  return getCollectiveVoting(
    motionHash,
    { blockHash, blockHeight },
    moduleName
  );
}

module.exports = {
  getCollectiveVoting,
  getCollectiveVotingByHeight,
};
