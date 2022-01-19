const {
  updateTreasuryProposal,
} = require("../../../mongo/service/onchain/treasuryProposal");
const {
  log: { logger },
  business: { getTreasuryProposalFieldsWhenAwarded },
} = require("@subsquare/scan-common");

async function handleAwarded(event, indexer) {
  const { proposalIndex, state, timelineItem } =
    await getTreasuryProposalFieldsWhenAwarded(...arguments);

  await updateTreasuryProposal(proposalIndex, { state }, timelineItem);
  logger.info(`Treasury proposal ${proposalIndex} awarded`);
}

module.exports = {
  handleAwarded,
};
