const { findBlockApi } = require("../../../chain/blockApi");
const { getApi } = require("../../../api");
const { isKarura } = require("../../../env");

async function getMotionVoting(motionHash, indexer) {
  const blockApi = await findBlockApi(indexer.blockHash);

  let raw;
  if (isKarura()) {
    raw = await blockApi.query.generalCouncil.voting(motionHash);
  } else {
    raw = await blockApi.query.council.voting(motionHash);
  }
  return raw.toJSON();
}

async function getVotingFromStorageByHeight(motionHash, blockHeight) {
  const api = await getApi();
  const blockHash = await api.rpc.chain.getBlockHash(blockHeight);
  return await getMotionVoting(motionHash, { blockHash, blockHeight });
}

module.exports = {
  getVotingFromStorage: getMotionVoting,
  getVotingFromStorageByHeight,
  getMotionVoting,
};
