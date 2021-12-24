const { getCollectiveVotingByHeight } = require("../common/collective/voting");
const { CollectiveEvents, TimelineItemTypes } = require("../common/constants");

async function getCollectiveClosedCommonFields(event, indexer, moduleName) {
  const eventData = event.data.toJSON();
  const [hash, yesVotes, noVotes] = eventData;

  const voting = await getCollectiveVotingByHeight(
    hash,
    indexer.blockHeight - 1,
    moduleName
  );

  const state = {
    state: CollectiveEvents.Closed,
    data: eventData,
    indexer,
  };

  const timelineItem = {
    type: TimelineItemTypes.event,
    method: CollectiveEvents.Closed,
    args: {
      hash,
      yesVotes,
      noVotes,
    },
    indexer,
  };

  const updates = { voting, state };
  return { hash, updates, timelineItem };
}

module.exports = {
  getCollectiveClosedCommonFields,
};
