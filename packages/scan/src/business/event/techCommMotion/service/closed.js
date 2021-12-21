const {
  updateTechCommMotionByHash,
} = require("../../../../mongo/service/onchain/techCommMotion");
const {
  business: {
    consts: { TimelineItemTypes, TechnicalCommitteeEvents },
  },
} = require("@subsquare/scan-common");

async function handleClosed(event, extrinsic, indexer) {
  const eventData = event.data.toJSON();
  const [hash, yesVotes, noVotes] = eventData;

  const state = {
    state: TechnicalCommitteeEvents.Closed,
    data: eventData,
    indexer,
  };

  const timelineItem = {
    type: TimelineItemTypes.event,
    method: TechnicalCommitteeEvents.Closed,
    args: {
      hash,
      yesVotes,
      noVotes,
    },
    indexer,
  };

  const updates = { state };
  await updateTechCommMotionByHash(hash, updates, timelineItem);
}

module.exports = {
  handleClosed,
};
