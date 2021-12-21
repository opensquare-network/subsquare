const {
  chain: { findBlockApi },
} = require("@subsquare/scan-common");

async function getPublicProposalFromStorage(proposalIndex, indexer) {
  const blockApi = await findBlockApi(indexer.blockHash);
  const raw = await blockApi.query.democracy.publicProps();
  const allProposals = raw.toJSON() || [];
  return allProposals.find(([index]) => index === proposalIndex);
}

module.exports = {
  getPublicProposalFromStorage,
};
