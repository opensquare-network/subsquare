const {
  getVotingFromStorage,
} = require("../../../common/motion/votingStorage");
const {
  TimelineItemTypes,
  CouncilEvents,
} = require("../../../common/constants");
const {
  updateMotionByHash,
} = require("../../../../mongo/service/onchain/motion");

async function handleVoted(registry, event, extrinsic, indexer) {
  const eventData = event.data.toJSON();
  const [voter, hash, approve, yesVotes, noVotes] = eventData;

  const voting = await getVotingFromStorage(hash, indexer);
  const updates = { voting };
  const timelineItem = {
    type: TimelineItemTypes.event,
    method: CouncilEvents.Voted,
    args: {
      voter,
      hash,
      approve,
      yesVotes,
      noVotes,
    },
    indexer,
  };

  await updateMotionByHash(hash, updates, timelineItem);
}

module.exports = {
  handleVoted,
};
