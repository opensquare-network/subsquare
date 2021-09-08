const { expandMetadata } = require("@polkadot/types");
const { findMetadata } = require("../../../specs");
const { getApi } = require("../../../api");

async function getTechCommMotionVoting(motionHash, indexer) {
  const metadata = await findMetadata(indexer.blockHeight);
  const decorated = expandMetadata(metadata.registry, metadata);
  const key = [decorated.query.technicalCommittee.voting, motionHash];

  const api = await getApi();
  const raw = await api.rpc.state.getStorage(key, indexer.blockHash);
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
