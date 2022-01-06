const {
  updateDemocracyReferendum,
} = require("../../../../mongo/service/onchain/democracyReferendum");
const {
  business: {
    consts: { ReferendumEvents, TimelineItemTypes },
    getReferendumInfoFromStorage,
    getReferendumInfoByHeight,
  },
} = require("@subsquare/scan-common");

async function handlePassed(event, indexer) {
  const eventData = event.data.toJSON();
  const [referendumIndex] = eventData;

  const { ongoing } = await getReferendumInfoByHeight(
    referendumIndex,
    indexer.blockHeight - 1
  );

  const finishedInfo = await getReferendumInfoFromStorage(
    referendumIndex,
    indexer
  );

  const state = {
    indexer,
    state: ReferendumEvents.Passed,
    data: eventData,
  };

  const timelineItem = {
    type: TimelineItemTypes.event,
    method: ReferendumEvents.Passed,
    args: {
      referendumIndex,
    },
    indexer,
  };

  await updateDemocracyReferendum(
    referendumIndex,
    {
      status: ongoing,
      info: finishedInfo,
      state,
    },
    timelineItem
  );
}

module.exports = {
  handlePassed,
};
