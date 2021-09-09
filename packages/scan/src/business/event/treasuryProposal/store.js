const {
  insertTreasuryProposalPost,
} = require("../../../mongo/service/business/treasuryProposal");
const {
  insertTreasuryProposal,
  updateTreasuryProposal,
} = require("../../../mongo/service/treasuryProposal");
const {
  TimelineItemTypes,
  TreasuryProposalEvents,
} = require("../../common/constants");
const {
  getTreasuryProposalMeta,
} = require("../../common/treasuryProposal/meta");
const { logger } = require("../../../logger");

async function saveNewTreasuryProposal(event, extrinsic, eventIndexer) {
  const [proposalIndex] = event.data.toJSON();

  const meta = await getTreasuryProposalMeta(proposalIndex, eventIndexer);
  const { proposer, value, beneficiary } = meta;
  const authors = [...new Set([proposer, extrinsic.signer.toString()])];

  const timelineItem = {
    type: TimelineItemTypes.extrinsic,
    method: TreasuryProposalEvents.Proposed,
    args: {
      index: proposalIndex,
    },
    indexer: eventIndexer,
  };

  const state = {
    indexer: eventIndexer,
    state: TreasuryProposalEvents.Proposed,
    data: event.data.toJSON(),
  };

  const obj = {
    indexer: eventIndexer,
    proposalIndex,
    authors,
    proposer,
    value,
    beneficiary,
    meta,
    state,
    timeline: [timelineItem],
  };

  await insertTreasuryProposal(obj);
  await insertTreasuryProposalPost(obj);
  logger.info(`Treasury proposal ${proposalIndex} saved`);
}

async function handleAwarded(event, eventIndexer) {
  const eventData = event.data.toJSON();
  const [proposalIndex, award, beneficiary] = eventData;

  const state = {
    name: TreasuryProposalEvents.Awarded,
    data: eventData,
    indexer: eventIndexer,
  };

  const timelineItem = {
    type: TimelineItemTypes.event,
    name: TreasuryProposalEvents.Awarded,
    args: {
      award,
      beneficiary,
    },
    indexer: eventIndexer,
  };

  await updateTreasuryProposal(proposalIndex, { state }, timelineItem);
  logger.info(`Treasury proposal ${proposalIndex} awarded`);
}

async function handleRejected(event, extrinsic, eventIndexer) {
  const eventData = event.data.toJSON();
  const [proposalIndex, slashed] = eventData;

  const state = {
    name: TreasuryProposalEvents.Rejected,
    data: eventData,
    indexer: eventIndexer,
  };

  const timelineItem = {
    type: TimelineItemTypes.extrinsic,
    name: TreasuryProposalEvents.Rejected,
    args: {
      slashed,
    },
    indexer: eventIndexer,
  };

  await updateTreasuryProposal(proposalIndex, { state }, timelineItem);
  logger.info(`Treasury proposal ${proposalIndex} rejected`);
}

module.exports = {
  saveNewTreasuryProposal,
  handleTreasuryProposalAwarded: handleAwarded,
  handleTreasuryProposalRejected: handleRejected,
};
