const {
  updateDemocracyReferendum,
} = require("../../../../mongo/service/onchain/democracyReferendum");
const {
  ReferendumEvents,
  TimelineItemTypes,
} = require("../../../common/constants");
const {
  getReferendumInfoByHeight,
  getReferendumInfoFromStorage,
} = require("../../../common/democracy/referendum/referendumStorage");

async function handleNotPassed(event, indexer) {
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
    state: ReferendumEvents.NotPassed,
    data: eventData,
  };

  const timelineItem = {
    type: TimelineItemTypes.event,
    method: ReferendumEvents.NotPassed,
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
  handleNotPassed,
};
