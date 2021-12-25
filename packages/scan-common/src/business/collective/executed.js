const { CollectiveEvents, TimelineItemTypes } = require("../common/constants");

async function getCollectiveExecutedCommonFields(event, indexer) {
  const eventData = event.data.toJSON();
  const [hash, dispatchResult] = eventData;

  const state = {
    state: CollectiveEvents.Executed,
    data: eventData,
    indexer,
  };

  const timelineItem = {
    type: TimelineItemTypes.event,
    method: CollectiveEvents.Executed,
    args: {
      hash,
      dispatchResult,
    },
    indexer,
  };

  return {
    hash,
    isOk: Object.keys(dispatchResult).includes("ok"),
    updates: { state, isFinal: true },
    timelineItem,
  };
}

module.exports = {
  getCollectiveExecutedCommonFields,
};
