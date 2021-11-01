const { findBlockApi } = require("../../../chain/specs");
const { findRegistry } = require("../../../chain/specs");
const { normalizeCall } = require("./utils");
const { isKarura } = require("../../../env");
const { GenericCall } = require("@polkadot/types");

async function getMotionProposal(motionHash, indexer) {
  const blockApi = await findBlockApi(indexer);

  let raw = null;
  if (isKarura()) {
    raw = await blockApi.query.generalCouncil.proposalOf(motionHash);
  } else if (blockApi.query.council.proposalOf) {
    raw = await blockApi.query.council.proposalOf(motionHash);
  }

  return raw;
}

async function getMotionProposalCall(motionHash, indexer) {
  const raw = await getMotionProposal(motionHash, indexer);
  const registry = await findRegistry(indexer.blockHeight);
  return normalizeCall(new GenericCall(registry, raw.toHex()));
}

module.exports = {
  getMotionProposal,
  getMotionProposalCall,
};
