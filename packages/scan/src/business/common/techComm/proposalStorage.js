const { GenericCall } = require("@polkadot/types");
const { normalizeCall } = require("../motion/utils");
const { getApi } = require("../../../api");
const { findDecorated, findRegistry } = require("../../../specs");

async function getTechCommMotionProposal(motionHash, indexer) {
  const decorated = await findDecorated(indexer.blockHeight);
  const key = [decorated.query.technicalCommittee.proposalOf, motionHash];

  const api = await getApi();
  return api.rpc.state.getStorage(key, indexer.blockHash);
}

async function getTechCommMotionProposalCall(motionHash, indexer) {
  const raw = await getTechCommMotionProposal(motionHash, indexer);
  const registry = await findRegistry(indexer.blockHeight);
  return normalizeCall(new GenericCall(registry, raw.toHex()));
}

module.exports = {
  getTechCommMotionProposalCall,
};
