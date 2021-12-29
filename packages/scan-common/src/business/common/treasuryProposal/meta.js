const { findBlockApi } = require("../../../chain/blockApi");

async function getTreasuryProposalMeta(proposalIndex, indexer) {
  const blockApi = await findBlockApi(indexer.blockHash);
  const raw = await blockApi.query.treasury.proposals(proposalIndex);
  return raw.toJSON();
}

module.exports = {
  getTreasuryProposalMeta,
};
