const { findBlockApi } = require("../../../chain/specs");
const { findRegistry } = require("../../../chain/specs");
const { GenericCall } = require("@polkadot/types");
const { normalizeCall } = require("../motion/utils");

async function getTechCommMotionProposal(motionHash, indexer) {
  const blockApi = await findBlockApi(indexer);
  const raw = await blockApi.query.technicalCommittee.proposalOf(motionHash);
  const registry = await findRegistry(indexer);
  return new GenericCall(registry, raw.toHex());
}

async function getTechCommMotionProposalCall(motionHash, indexer) {
  return normalizeCall(await getTechCommMotionProposal(motionHash, indexer));
}

module.exports = {
  getTechCommMotionProposal,
  getTechCommMotionProposalCall,
};
