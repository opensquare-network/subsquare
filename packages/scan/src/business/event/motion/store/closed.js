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

async function handleClosed(registry, event, extrinsic, indexer) {
  const eventData = event.data.toJSON();
  const [hash, yesVotes, noVotes] = eventData;

  const voting = await getVotingFromStorage(hash, indexer.blockHash);

  const state = {
    state: CouncilEvents.Closed,
    data: eventData,
    indexer,
  };

  const timelineItem = {
    type: TimelineItemTypes.event,
    method: CouncilEvents.Closed,
    args: {
      hash,
      yesVotes,
      noVotes,
    },
    indexer,
  };

  const updates = { voting, state };
  await updateMotionByHash(hash, updates, timelineItem);
}

module.exports = {
  handleClosed,
};
