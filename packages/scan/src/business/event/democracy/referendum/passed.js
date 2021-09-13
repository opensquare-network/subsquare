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

async function handlePassed(event, indexer) {
  const eventData = event.data.toJSON();
  const [referendumIndex] = eventData;

  const ongoingInfo = await getReferendumInfoByHeight(
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
      status: ongoingInfo,
      info: finishedInfo,
      state,
    },
    timelineItem
  );
}

module.exports = {
  handlePassed,
};
