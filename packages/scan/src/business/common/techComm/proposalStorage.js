const { GenericCall } = require("@polkadot/types");
const { normalizeCall } = require("../motion/utils");
const {
  chain: {
    findBlockApi,
    specs: { findRegistry },
  },
} = require("@subsquare/scan-common");

async function getTechCommMotionProposal(motionHash, indexer) {
  const blockApi = await findBlockApi(indexer.blockHash);
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
