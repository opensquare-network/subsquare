const { handleBusinessWhenMotionExecuted } = require("./hooks/executed");
const {
  TimelineItemTypes,
  CouncilEvents,
} = require("../../../common/constants");
const {
  updateMotionByHash,
} = require("../../../../mongo/service/onchain/motion");
const { logger } = require("../../../../logger");

async function handleExecuted(event, extrinsic, indexer) {
  const eventData = event.data.toJSON();
  const [hash, dispatchResult] = eventData;

  const state = {
    state: CouncilEvents.Executed,
    data: eventData,
    indexer,
  };

  const timelineItem = {
    type: TimelineItemTypes.event,
    method: CouncilEvents.Executed,
    args: {
      hash,
      dispatchResult,
    },
    indexer,
  };

  try {
    if (Object.keys(dispatchResult).includes("ok")) {
      await handleBusinessWhenMotionExecuted(hash, indexer);
    }
  } catch (e) {
    logger.error("Handle motion executed hooks failed", e);
  } finally {
    const updates = { state, isFinal: true };
    await updateMotionByHash(hash, updates, timelineItem);
  }
}

module.exports = {
  handleExecuted,
};
