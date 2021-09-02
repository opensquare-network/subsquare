const { expandMetadata } = require("@polkadot/types");
const { findMetadata } = require("../../../mongo/service/specs");
const { getApi } = require("../../../api");
const { isKarura } = require("../../../env");

async function getMotionVoting(motionHash, indexer) {
  const metadata = await findMetadata(indexer.blockHeight);
  const decorated = expandMetadata(metadata.registry, metadata);
  let key;
  if (isKarura()) {
    key = [decorated.query.generalCouncil.voting, motionHash];
  } else {
    key = [decorated.query.council.voting, motionHash];
  }

  const api = await getApi();
  const raw = await api.rpc.state.getStorage(key, indexer.blockHash);
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
