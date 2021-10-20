const { findRegistryByHash } = require("../../../chain/blockApi");
const { findBlockApi } = require("../../../chain/blockApi");
const { GenericCall } = require("@polkadot/types");
const { normalizeCall } = require("../motion/utils");

async function getTechCommMotionProposal(motionHash, indexer) {
  const blockApi = await findBlockApi(indexer.blockHash);
  return blockApi.query.technicalCommittee.proposalOf(motionHash);
}

async function getTechCommMotionProposalCall(motionHash, indexer) {
  const raw = await getTechCommMotionProposal(motionHash, indexer);
  const registry = await findRegistryByHash(indexer.blockHash);
  return normalizeCall(new GenericCall(registry, raw.toHex()));
}

module.exports = {
  getTechCommMotionProposalCall,
};
