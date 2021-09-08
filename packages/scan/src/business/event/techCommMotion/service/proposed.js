const {
  insertTechCommMotion,
} = require("../../../../mongo/service/onchain/techCommMotion");
const {
  TimelineItemTypes,
  CouncilEvents,
} = require("../../../common/constants");
const {
  getTechCommMotionVotingFromStorage,
} = require("../../../common/techComm/votingStorage");
const {
  getTechCommMotionProposalCall,
} = require("../../../common/techComm/proposalStorage");

async function handleProposed(event, extrinsic, indexer) {
  const eventData = event.data.toJSON();
  const [proposer, motionIndex, hash, threshold] = eventData;
  const authors = [...new Set([proposer, extrinsic.signer.toString()])];

  const proposal = await getTechCommMotionProposalCall(hash, indexer);
  const voting = await getTechCommMotionVotingFromStorage(hash, indexer);

  const timelineItem = {
    type: TimelineItemTypes.event,
    method: CouncilEvents.Proposed,
    args: {
      proposer,
      index: motionIndex,
      hash,
      threshold,
    },
    indexer,
  };

  const state = {
    indexer,
    state: CouncilEvents.Proposed,
    data: eventData,
  };

  const obj = {
    indexer,
    hash,
    proposer,
    index: motionIndex,
    threshold,
    authors,
    // ...extractBusinessFields(proposal),
    proposal,
    voting,
    isFinal: false,
    state,
    timeline: [timelineItem],
  };

  await insertTechCommMotion(obj);
}

module.exports = {
  handleProposed,
};
