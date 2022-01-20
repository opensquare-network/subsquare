const {
  updateTreasuryProposal,
} = require("../../../mongo/service/onchain/treasuryProposal");
const {
  log: { logger },
  business: { getTreasuryProposalFieldsWhenRejected },
} = require("@subsquare/scan-common");

async function handleRejected(event, indexer) {
  const { proposalIndex, state, timelineItem } =
    await getTreasuryProposalFieldsWhenRejected(...arguments);

  await updateTreasuryProposal(proposalIndex, { state }, timelineItem);
  logger.info(`Treasury proposal ${proposalIndex} rejected`);
}

module.exports = {
  handleRejected,
};
