const {
  chain: { findBlockApi },
} = require("@subsquare/scan-common");

async function getTreasuryProposalMeta(proposalIndex, indexer) {
  const blockApi = await findBlockApi(indexer.blockHash);
  const raw = await blockApi.query.treasury.proposals(proposalIndex);
  return raw.toJSON();
}

module.exports = {
  getTreasuryProposalMeta,
};
