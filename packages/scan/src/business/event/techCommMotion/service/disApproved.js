const {
  updateTechCommMotionByHash,
} = require("../../../../mongo/service/onchain/techCommMotion");
const {
  business: {
    consts: { TimelineItemTypes, TechnicalCommitteeEvents },
  },
} = require("@subsquare/scan-common");

async function handleDisApproved(event, extrinsic, indexer) {
  const eventData = event.data.toJSON();
  const [hash] = eventData;

  const state = {
    state: TechnicalCommitteeEvents.Disapproved,
    data: eventData,
    indexer,
  };

  const timelineItem = {
    type: TimelineItemTypes.event,
    method: TechnicalCommitteeEvents.Disapproved,
    args: {
      hash,
    },
    indexer,
  };

  const updates = { state, isFinal: true };
  await updateTechCommMotionByHash(hash, updates, timelineItem);
}

module.exports = {
  handleDisApproved,
};
