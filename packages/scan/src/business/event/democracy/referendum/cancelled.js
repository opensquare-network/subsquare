const {
  updateDemocracyReferendum,
} = require("../../../../mongo/service/onchain/democracyReferendum");
const {
  business: {
    consts: { ReferendumEvents, TimelineItemTypes },
    getReferendumInfoByHeight,
  },
} = require("@subsquare/scan-common");

async function handleCancelled(event, extrinsic, indexer) {
  const eventData = event.data.toJSON();
  const [referendumIndex] = eventData;

  const referendumInfo = await getReferendumInfoByHeight(
    referendumIndex,
    indexer.blockHeight - 1
  );

  const state = {
    indexer,
    state: ReferendumEvents.Cancelled,
    data: eventData,
  };

  const timelineItem = {
    type: TimelineItemTypes.event,
    method: ReferendumEvents.Cancelled,
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
  handleCancelled,
};
