const { CollectiveEvents, TimelineItemTypes } = require("../common/constants");

async function getCollectiveApprovedCommonFields(event, indexer, moduleName) {
  const eventData = event.data.toJSON();
  const [hash] = eventData;

  const state = {
    state: CollectiveEvents.Approved,
    data: eventData,
    indexer,
  };

  const timelineItem = {
    type: TimelineItemTypes.event,
    method: CollectiveEvents.Approved,
    args: {
      hash,
    },
    indexer,
  };

  const updates = { state };

  return {
    hash,
    updates,
    timelineItem,
  };
}

module.exports = {
  getCollectiveApprovedCommonFields,
};
