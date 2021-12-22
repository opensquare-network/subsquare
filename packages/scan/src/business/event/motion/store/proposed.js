const { getMotionCall } = require("../../../common/motion/proposalStorage");
const {
  insertMotionPost,
} = require("../../../../mongo/service/business/motion");
const { handleBusinessWhenMotionProposed } = require("./hooks/proposed");
const {
  getVotingFromStorage,
} = require("../../../common/motion/votingStorage");
const { insertMotion } = require("../../../../mongo/service/onchain/motion");
const {
  business: {
    consts: { TimelineItemTypes, CouncilEvents },
    extractCouncilMotionBusiness,
    normalizeCall,
  },
} = require("@subsquare/scan-common");

async function handleProposed(event, extrinsic, indexer, blockEvents) {
  const eventData = event.data.toJSON();
  const [proposer, motionIndex, hash, threshold] = eventData;

  const call = await getMotionCall(hash, indexer);
  const proposal = normalizeCall(call);

  const voting = await getVotingFromStorage(hash, indexer);

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

  const authors = [...new Set([proposer, extrinsic.signer.toString()])];

  const { treasuryProposals, treasuryBounties, externalProposals } =
    await extractCouncilMotionBusiness(call, proposer, indexer, blockEvents);

  const obj = {
    indexer,
    hash,
    authors,
    proposer,
    index: motionIndex,
    threshold,
    proposal,
    voting,
    isFinal: false,
    state,
    timeline: [timelineItem],
    treasuryProposals,
    treasuryBounties,
    externalProposals,
  };

  await insertMotion(obj);
  await insertMotionPost(indexer, hash, motionIndex, proposer);
  await handleBusinessWhenMotionProposed(obj, call, indexer, blockEvents);
}

module.exports = {
  handleProposed,
};
