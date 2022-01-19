const {
  insertTreasuryProposalPost,
} = require("../../../mongo/service/business/treasuryProposal");
const {
  insertTreasuryProposal,
  updateTreasuryProposal,
} = require("../../../mongo/service/treasuryProposal");
const {
  log: { logger },
  business: {
    getTreasuryProposalFieldsWhenProposed,
    getTreasuryProposalFieldsWhenAwarded,
    getTreasuryProposalFieldsWhenRejected,
  },
} = require("@subsquare/scan-common");

async function saveNewTreasuryProposal(event, indexer, events, extrinsic) {
  const commonObj = await getTreasuryProposalFieldsWhenProposed(...arguments);
  const obj = {
    ...commonObj,
    motions: [],
  };

  await insertTreasuryProposal(obj);
  await insertTreasuryProposalPost(obj);
  logger.info(`Treasury proposal ${commonObj.proposalIndex} saved`);
}

async function handleAwarded(event, indexer) {
  const { proposalIndex, state, timelineItem } =
    await getTreasuryProposalFieldsWhenAwarded(...arguments);

  await updateTreasuryProposal(proposalIndex, { state }, timelineItem);
  logger.info(`Treasury proposal ${proposalIndex} awarded`);
}

async function handleRejected(event, indexer) {
  const { proposalIndex, state, timelineItem } =
    await getTreasuryProposalFieldsWhenRejected(...arguments);

  await updateTreasuryProposal(proposalIndex, { state }, timelineItem);
  logger.info(`Treasury proposal ${proposalIndex} rejected`);
}

module.exports = {
  saveNewTreasuryProposal,
  handleTreasuryProposalAwarded: handleAwarded,
  handleTreasuryProposalRejected: handleRejected,
};
