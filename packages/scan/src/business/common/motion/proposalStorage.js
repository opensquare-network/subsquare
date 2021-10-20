const { findRegistryByHash } = require("../../../chain/blockApi");
const { findBlockApi } = require("../../../chain/blockApi");
const { normalizeCall } = require("./utils");
const { isKarura } = require("../../../env");
const { GenericCall } = require("@polkadot/types");

async function getMotionProposal(motionHash, indexer) {
  const blockApi = await findBlockApi(indexer.blockHash);

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
  const registry = await findRegistryByHash(indexer.blockHash);
  return normalizeCall(new GenericCall(registry, raw.toHex()));
}

module.exports = {
  getMotionProposal,
  getMotionProposalCall,
};
