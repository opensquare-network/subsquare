const { handleBusinessWhenMotionVoted } = require("./hooks/voted");
const {
  getVotingFromStorage,
} = require("../../../common/motion/votingStorage");
const {
  business: {
    consts: { TimelineItemTypes, CouncilEvents },
  },
} = require("@subsquare/scan-common");
const {
  updateMotionByHash,
} = require("../../../../mongo/service/onchain/motion");

async function handleVoted(event, extrinsic, indexer) {
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
  await handleBusinessWhenMotionVoted(hash, voting, indexer);
}

module.exports = {
  handleVoted,
};
