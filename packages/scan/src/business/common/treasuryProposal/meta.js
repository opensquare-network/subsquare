const { findBlockApi } = require("../../../chain/blockApi");

async function getTreasuryProposalMeta(
  proposalIndex,
  { blockHeight, blockHash }
) {
  const blockApi = await findBlockApi(blockHash);
  const raw = await blockApi.query.treasury.proposals(proposalIndex);
  return raw.toJSON();
}

module.exports = {
  getTreasuryProposalMeta,
};
