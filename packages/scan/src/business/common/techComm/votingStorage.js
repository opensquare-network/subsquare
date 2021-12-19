const {
  chain: { getApi, findBlockApi },
} = require("@subsquare/scan-common");

async function getTechCommMotionVoting(motionHash, indexer) {
  const blockApi = await findBlockApi(indexer.blockHash);
  const raw = await blockApi.query.technicalCommittee.voting(motionHash);
  return raw.toJSON();
}

async function getTechCommVotingFromStorageByHeight(motionHash, blockHeight) {
  const api = await getApi();
  const blockHash = await api.rpc.chain.getBlockHash(blockHeight);
  return await getTechCommMotionVoting(motionHash, { blockHash, blockHeight });
}

module.exports = {
  getTechCommMotionVotingFromStorage: getTechCommMotionVoting,
  getTechCommVotingFromStorageByHeight,
};
