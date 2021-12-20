const { GenericCall } = require("@polkadot/types");
const {
  chain: {
    findBlockApi,
    specs: { findRegistry },
  },
  business: { normalizeCall },
} = require("@subsquare/scan-common");

async function getTechCommMotionProposal(motionHash, indexer) {
  const blockApi = await findBlockApi(indexer.blockHash);
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
