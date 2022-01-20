const {
  TreasuryProposalEvents,
  TimelineItemTypes,
} = require("../common/constants");

async function getTreasuryProposalFieldsWhenAwarded(event, indexer) {
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

  return {
    proposalIndex,
    state,
    timelineItem,
  };
}

module.exports = {
  getTreasuryProposalFieldsWhenAwarded,
};
