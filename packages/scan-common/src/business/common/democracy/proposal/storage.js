const { findBlockApi } = require("../../../../chain/blockApi");

async function getPublicProposalFromStorage(proposalIndex, indexer) {
  const blockApi = await findBlockApi(indexer.blockHash);
  const raw = await blockApi.query.democracy.publicProps();
  const allProposals = raw.toJSON() || [];
  return allProposals.find(([index]) => index === proposalIndex);
}

async function getPublicProposalDeposit(proposalIndex, indexer) {
  const blockApi = await findBlockApi(indexer.blockHash);
  const raw = await blockApi.query.democracy.depositOf(proposalIndex);
  return raw.toJSON();
}

module.exports = {
  getPublicProposalFromStorage,
  getPublicProposalDeposit,
};
