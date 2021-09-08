const {
  insertReferendumPostSolo,
} = require("../../../../mongo/service/business/democracy");
const {
  insertDemocracyReferendum,
} = require("../../../../mongo/service/onchain/democracyReferendum");
const { getReferendumInfoFromStorage } = require("../common/referendumStorage");
const {
  ReferendumEvents,
  TimelineItemTypes,
} = require("../../../common/constants");

async function handleStarted(event, indexer) {
  const eventData = event.data.toJSON();
  const [referendumIndex, threshold] = eventData;

  const referendumInfo = await getReferendumInfoFromStorage(
    referendumIndex,
    indexer
  );

  const state = {
    indexer,
    state: ReferendumEvents.Started,
    data: eventData,
  };

  const timelineItem = {
    type: TimelineItemTypes.event,
    method: ReferendumEvents.Started,
    args: {
      referendumIndex,
      voteThreshold: threshold,
    },
    indexer,
  };

  const obj = {
    indexer,
    referendumIndex,
    info: referendumInfo,
    state,
    timeline: [timelineItem],
  };

  await insertDemocracyReferendum(obj);
  await insertReferendumPostSolo(referendumIndex);
}

module.exports = {
  handleStarted,
};
