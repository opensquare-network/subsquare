const { getApi } = require("../../../../api");
const { expandMetadata } = require("@polkadot/types");
const { findMetadata } = require("../../../../specs");

async function getPublicProposalFromStorage(proposalIndex, indexer) {
  const metadata = await findMetadata(indexer.blockHeight);
  const decorated = expandMetadata(metadata.registry, metadata);
  const key = [decorated.query.democracy.publicProps];

  const api = await getApi();
  const rawMeta = await api.rpc.state.getStorage(key, indexer.blockHash);
  const allProposals = rawMeta.toJSON() || [];
  return allProposals.find(([index]) => index === proposalIndex);
}

module.exports = {
  getPublicProposalFromStorage,
};
