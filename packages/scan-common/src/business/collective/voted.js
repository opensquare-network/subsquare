const {
  CollectiveEvents,
  TimelineItemTypes,
  CollectiveStates,
} = require("../common/constants");
const { getCollectiveVoting } = require("../common/collective/voting");

async function getCollectiveVotedCommonFields(event, indexer, moduleName) {
  const eventData = event.data.toJSON();
  const [voter, hash, approve, yesVotes, noVotes] = eventData;

  const voting = await getCollectiveVoting(hash, indexer, moduleName);

  const state = {
    indexer,
    state: CollectiveStates.Voting,
    args: {
      yesVotes,
      noVotes,
    },
  };

  const updates = { voting, state };
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
