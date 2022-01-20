const {
  TreasuryProposalEvents,
  TimelineItemTypes,
} = require("../common/constants");
const { getTreasuryProposalMeta } = require("../common/treasuryProposal/meta");

async function getTreasuryProposalFieldsWhenProposed(
  event,
  indexer,
  events,
  extrinsic
) {
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

  return {
    indexer,
    proposalIndex,
    authors,
    proposer,
    value,
    beneficiary,
    meta,
    state,
    timeline: [timelineItem],
  };
}

module.exports = {
  getTreasuryProposalFieldsWhenProposed,
};
