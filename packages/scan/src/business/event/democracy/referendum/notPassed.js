const {
  updateDemocracyReferendum,
} = require("../../../../mongo/service/onchain/democracyReferendum");
const {
  ReferendumEvents,
  TimelineItemTypes,
} = require("../../../common/constants");
const { getReferendumInfoByHeight } = require("../common/referendumStorage");

async function handleNotPassed(event, indexer) {
  const eventData = event.data.toJSON();
  const [referendumIndex] = eventData;

  const referendumInfo = await getReferendumInfoByHeight(
    referendumIndex,
    indexer.blockHeight - 1
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
      info: referendumInfo,
      state,
    },
    timelineItem
  );
}

module.exports = {
  handleNotPassed,
};
