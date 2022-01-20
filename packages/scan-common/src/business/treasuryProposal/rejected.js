const {
  TreasuryProposalEvents,
  TimelineItemTypes,
} = require("../common/constants");

async function getTreasuryProposalFieldsWhenRejected(event, indexer) {
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

  return {
    proposalIndex,
    state,
    timelineItem,
  };
}

module.exports = {
  getTreasuryProposalFieldsWhenRejected,
};
