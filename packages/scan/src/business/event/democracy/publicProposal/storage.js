const { findDecorated } = require("../../../../specs");
const { getApi } = require("../../../../api");

async function getPublicProposalFromStorage(proposalIndex, indexer) {
  const decorated = await findDecorated(indexer.blockHeight);
  const key = [decorated.query.democracy.publicProps];

  const api = await getApi();
  const rawMeta = await api.rpc.state.getStorage(key, indexer.blockHash);
  const allProposals = rawMeta.toJSON() || [];
  return allProposals.find(([index]) => index === proposalIndex);
}

module.exports = {
  getPublicProposalFromStorage,
};
