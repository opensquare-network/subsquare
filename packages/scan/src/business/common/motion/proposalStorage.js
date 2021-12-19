const { normalizeCall } = require("./utils");
const { GenericCall } = require("@polkadot/types");
const {
  chain: {
    findBlockApi,
    specs: { findRegistry },
  },
  env: { isKarura },
} = require("@subsquare/scan-common");

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

async function getMotionCall(motionHash, indexer) {
  const raw = await getMotionProposal(indexer.blockHash, motionHash);
  const registry = await findRegistry(indexer);
  return new GenericCall(registry, raw.toHex());
}

async function getMotionProposalCall(motionHash, indexer) {
  const raw = await getMotionProposal(motionHash, indexer);
  const blockApi = await findBlockApi(indexer.blockHash);
  return normalizeCall(new GenericCall(blockApi.registry, raw.toHex()));
}

module.exports = {
  getMotionCall,
  getMotionProposal,
  getMotionProposalCall,
};
