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
    consts: { TimelineItemTypes, TreasuryProposalEvents },
    getTreasuryProposalMeta,
  },
} = require("@subsquare/scan-common");

async function saveNewTreasuryProposal(event, indexer, events, extrinsic) {
  const [proposalIndex] = event.data.toJSON();

  const meta = await getTreasuryProposalMeta(proposalIndex, indexer);
  const { proposer, value, beneficiary } = meta;
  const authors = [...new Set([proposer, extrinsic?.signer.toString()])];

  const timelineItem = {
    type: TimelineItemTypes.extrinsic,
    method: TreasuryProposalEvents.Proposed,
    args: {
      index: proposalIndex,
    },
    indexer,
  };

  const state = {
    indexer,
    state: TreasuryProposalEvents.Proposed,
    data: event.data.toJSON(),
  };

  const obj = {
    indexer,
    proposalIndex,
    authors,
    proposer,
    value,
    beneficiary,
    meta,
    state,
    timeline: [timelineItem],
    motions: [],
  };

  await insertTreasuryProposal(obj);
  await insertTreasuryProposalPost(obj);
  logger.info(`Treasury proposal ${proposalIndex} saved`);
}

async function handleAwarded(event, indexer) {
  const eventData = event.data.toJSON();
  const [proposalIndex, award, beneficiary] = eventData;

  const state = {
    state: TreasuryProposalEvents.Awarded,
    data: eventData,
    indexer,
  };

  const timelineItem = {
    type: TimelineItemTypes.event,
    name: TreasuryProposalEvents.Awarded,
    args: {
      award,
      beneficiary,
    },
    indexer,
  };

  await updateTreasuryProposal(proposalIndex, { state }, timelineItem);
  logger.info(`Treasury proposal ${proposalIndex} awarded`);
}

async function handleRejected(event, indexer) {
  const eventData = event.data.toJSON();
  const [proposalIndex, slashed] = eventData;

  const state = {
    state: TreasuryProposalEvents.Rejected,
    data: eventData,
    indexer,
  };

  const timelineItem = {
    type: TimelineItemTypes.extrinsic,
    name: TreasuryProposalEvents.Rejected,
    args: {
      slashed,
    },
    indexer,
  };

  await updateTreasuryProposal(proposalIndex, { state }, timelineItem);
  logger.info(`Treasury proposal ${proposalIndex} rejected`);
}

module.exports = {
  saveNewTreasuryProposal,
  handleTreasuryProposalAwarded: handleAwarded,
  handleTreasuryProposalRejected: handleRejected,
};
