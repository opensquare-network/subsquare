const { CollectiveEvents, TimelineItemTypes } = require("../common/constants");
const { getCollectiveVoting } = require("../common/collective/voting");

async function getCollectiveVotedCommonFields(event, indexer, moduleName) {
  const eventData = event.data.toJSON();
  const [voter, hash, approve, yesVotes, noVotes] = eventData;

  const voting = await getCollectiveVoting(hash, indexer, moduleName);
  const updates = { voting };
  const timelineItem = {
    type: TimelineItemTypes.event,
    method: CollectiveEvents.Voted,
    args: {
      voter,
      hash,
      approve,
      yesVotes,
      noVotes,
    },
    indexer,
  };

  return { hash, updates, timelineItem, voting };
}

module.exports = {
  getCollectiveVotedCommonFields,
};
