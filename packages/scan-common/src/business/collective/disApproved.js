const { CollectiveEvents, TimelineItemTypes } = require("../common/constants");

async function getCollectiveDisApprovedCommonFields(event, extrinsic, indexer) {
  const eventData = event.data.toJSON();
  const [hash] = eventData;

  const state = {
    state: CollectiveEvents.Disapproved,
    data: eventData,
    indexer,
  };

  const timelineItem = {
    type: TimelineItemTypes.event,
    method: CollectiveEvents.Disapproved,
    args: {
      hash,
    },
    indexer,
  };

  const updates = { state, isFinal: true };

  return { hash, updates, timelineItem };
}

module.exports = {
  getCollectiveDisApprovedCommonFields,
};
