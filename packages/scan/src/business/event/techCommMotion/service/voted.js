const {
  getTechCommMotionVotingFromStorage,
} = require("../../../common/techComm/votingStorage");
const {
  updateTechCommMotionByHash,
} = require("../../../../mongo/service/onchain/techCommMotion");
const {
  TimelineItemTypes,
  TechnicalCommitteeEvents,
} = require("../../../common/constants");

async function handleVoted(event, extrinsic, indexer) {
  const eventData = event.data.toJSON();
  const [voter, hash, approve, yesVotes, noVotes] = eventData;

  const voting = await getTechCommMotionVotingFromStorage(hash, indexer);
  const updates = { voting };
  const timelineItem = {
    type: TimelineItemTypes.event,
    method: TechnicalCommitteeEvents.Voted,
    args: {
      voter,
      hash,
      approve,
      yesVotes,
      noVotes,
    },
    indexer,
  };

  await updateTechCommMotionByHash(hash, updates, timelineItem);
}

module.exports = {
  handleVoted,
};
