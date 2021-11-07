const { findBlockApi } = require("../../../chain/specs");
const { findRegistry } = require("../../../chain/specs");
const { GenericCall } = require("@polkadot/types");
const { normalizeCall } = require("../motion/utils");

async function getTechCommMotionProposal(motionHash, indexer) {
  const blockApi = await findBlockApi(indexer);
  return blockApi.query.technicalCommittee.proposalOf(motionHash);
}

async function getTechCommMotionProposalCall(motionHash, indexer) {
  const raw = await getTechCommMotionProposal(motionHash, indexer);
  const registry = await findRegistry(indexer);
  return normalizeCall(new GenericCall(registry, raw.toHex()));
}

module.exports = {
  getTechCommMotionProposalCall,
};
