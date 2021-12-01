const { findBlockApi, findRegistry } = require("../../../chain/specs");
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

async function getMotionCall(motionHash, indexer) {
  const raw = await getMotionProposal(indexer.blockHash, motionHash);
  const registry = await findRegistry(indexer);
  return new GenericCall(registry, raw.toHex());
}

async function getMotionProposalCall(motionHash, indexer) {
  const raw = await getMotionProposal(motionHash, indexer);
  const blockApi = await findBlockApi(indexer);
  return normalizeCall(new GenericCall(blockApi.registry, raw.toHex()));
}

module.exports = {
  getMotionCall,
  getMotionProposal,
  getMotionProposalCall,
};
