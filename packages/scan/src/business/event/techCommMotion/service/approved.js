const {
  updateTechCommMotionByHash,
} = require("../../../../mongo/service/onchain/techCommMotion");
const {
  TimelineItemTypes,
  TechnicalCommitteeEvents,
} = require("../../../common/constants");

async function handleApproved(event, extrinsic, indexer) {
  const eventData = event.data.toJSON();
  const [hash] = eventData;

  const state = {
    state: TechnicalCommitteeEvents.Approved,
    data: eventData,
    indexer,
  };

  const timelineItem = {
    type: TimelineItemTypes.event,
    method: TechnicalCommitteeEvents.Approved,
    args: {
      hash,
    },
    indexer,
  };

  const updates = { state };
  await updateTechCommMotionByHash(hash, updates, timelineItem);
}

module.exports = {
  handleApproved,
};
