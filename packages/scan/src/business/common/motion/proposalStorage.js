const { normalizeCall } = require("./utils");
const { findRegistry } = require("../../../mongo/service/specs");
const { expandMetadata } = require("@polkadot/types");
const { findMetadata } = require("../../../mongo/service/specs");
const { getApi } = require("../../../api");
const { isKarura } = require("../../../env");
const { GenericCall } = require("@polkadot/types");

async function getMotionProposal(motionHash, indexer) {
  const metadata = await findMetadata(indexer.blockHeight);
  const decorated = expandMetadata(metadata.registry, metadata);
  let key;
  if (isKarura()) {
    key = [decorated.query.generalCouncil.proposalOf, motionHash];
  } else if (decorated.query.council.proposalOf) {
    key = [decorated.query.council.proposalOf, motionHash];
  } else {
    return null;
  }

  const api = await getApi();
  return api.rpc.state.getStorage(key, indexer.blockHash);
}

async function getMotionProposalCall(motionHash, indexer) {
  const raw = await getMotionProposal(...arguments);
  const registry = await findRegistry(indexer.blockHeight);
  return normalizeCall(new GenericCall(registry, raw.toHex()));
}

module.exports = {
  getMotionProposalCall,
};
