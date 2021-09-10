const {
  handleBusinessWhenTechCommMotionExecuted,
} = require("./hooks/executed");
const {
  updateTechCommMotionByHash,
} = require("../../../../mongo/service/onchain/techCommMotion");
const {
  TimelineItemTypes,
  TechnicalCommitteeEvents,
} = require("../../../common/constants");

async function handleExecuted(event, extrinsic, indexer, extrinsicEvents) {
  const eventData = event.data.toJSON();
  const [hash, dispatchResult] = eventData;

  const state = {
    state: TechnicalCommitteeEvents.Executed,
    data: eventData,
    indexer,
  };

  const timelineItem = {
    type: TimelineItemTypes.event,
    method: TechnicalCommitteeEvents.Executed,
    args: {
      hash,
      dispatchResult,
    },
    indexer,
  };

  if (Object.keys(dispatchResult).includes("ok")) {
    await handleBusinessWhenTechCommMotionExecuted(
      hash,
      indexer,
      extrinsicEvents
    );
  }

  const updates = { state, isFinal: true };
  await updateTechCommMotionByHash(hash, updates, timelineItem);
}

module.exports = {
  handleExecuted,
};
