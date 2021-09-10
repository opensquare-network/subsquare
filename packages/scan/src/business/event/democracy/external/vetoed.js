const {
  updateDemocracyExternalByHash,
} = require("../../../../mongo/service/onchain/democracyExternal");
const {
  TimelineItemTypes,
  DemocracyExternalEvents,
} = require("../../../common/constants");

async function handleVetoed(event, extrinsic, indexer) {
  const eventData = event.data.toJSON();
  const [who, proposalHash, until] = eventData;

  const state = {
    state: DemocracyExternalEvents.Vetoed,
    data: eventData,
    indexer,
  };

  const timelineItem = {
    type: TimelineItemTypes.event,
    method: DemocracyExternalEvents.Vetoed,
    args: {
      who,
      proposalHash,
      until,
    },
    indexer,
  };

  await updateDemocracyExternalByHash(
    proposalHash,
    {
      state,
      isFinal: true,
    },
    timelineItem
  );
}

module.exports = {
  handleVetoed,
};
