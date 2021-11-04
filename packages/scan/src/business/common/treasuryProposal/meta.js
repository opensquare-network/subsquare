const { findBlockApi } = require("../../../chain/specs");

async function getTreasuryProposalMeta(proposalIndex, indexer) {
  const blockApi = await findBlockApi(indexer);
  const raw = await blockApi.query.treasury.proposals(proposalIndex);
  return raw.toJSON();
}

module.exports = {
  getTreasuryProposalMeta,
};
