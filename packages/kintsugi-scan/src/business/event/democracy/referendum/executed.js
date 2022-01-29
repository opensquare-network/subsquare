const {
  updateDemocracyReferendum,
} = require("../../../../mongo/service/onchain/democracyReferendum");
const {
  business: {
    consts: { ReferendumEvents, TimelineItemTypes },
  },
} = require("@subsquare/scan-common");

async function handleExecuted(event, indexer) {
  const eventData = event.data.toJSON();
  const [referendumIndex, executeResult] = eventData;

  const state = {
    indexer,
    state: ReferendumEvents.Executed,
    data: eventData,
  };

  const timelineItem = {
    type: TimelineItemTypes.event,
    method: ReferendumEvents.Executed,
    args: {
      referendumIndex,
      result: executeResult,
    },
    indexer,
  };

  await updateDemocracyReferendum(
    referendumIndex,
    {
      state,
    },
    timelineItem
  );
}

module.exports = {
  handleExecuted,
};
