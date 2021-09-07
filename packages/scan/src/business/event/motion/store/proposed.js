const { handleBusinessWhenMotionProposed } = require("./hooks/proposed");
const {
  Modules,
  TreasuryProposalMethods,
} = require("../../../common/constants");
const {
  getMotionProposalCall,
} = require("../../../common/motion/proposalStorage");
const {
  getVotingFromStorage,
} = require("../../../common/motion/votingStorage");
const {
  TimelineItemTypes,
  CouncilEvents,
} = require("../../../common/constants");
const { insertMotion } = require("../../../../mongo/service/onchain/motion");
const {
  insertMotionPost,
} = require("../../../../mongo/service/business/motion");

function extractBusinessFields(proposal = {}) {
  const { section, method, args } = proposal;
  const isTreasury =
    Modules.Treasury === section &&
    [
      TreasuryProposalMethods.approveProposal,
      TreasuryProposalMethods.rejectProposal,
    ].includes(method);

  if (!isTreasury) {
    return {};
  }

  return {
    isTreasury,
    treasuryProposalIndex: args[0].value,
  };
}

async function handleProposed(registry, event, extrinsic, indexer) {
  const eventData = event.data.toJSON();
  const [proposer, motionIndex, hash, memberCount] = eventData;

  const proposal = await getMotionProposalCall(hash, indexer);
  const voting = await getVotingFromStorage(hash, indexer);

  const timelineItem = {
    type: TimelineItemTypes.event,
    method: CouncilEvents.Proposed,
    args: {
      proposer,
      index: motionIndex,
      hash,
      memberCount,
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
    memberCount,
    ...extractBusinessFields(proposal),
    proposal,
    voting,
    isFinal: false,
    state,
    timeline: [timelineItem],
  };

  await insertMotion(obj);
  await insertMotionPost(indexer, hash, motionIndex, proposer, voting, state);
  await handleBusinessWhenMotionProposed(obj, indexer);
}

module.exports = {
  extractBusinessFields,
  handleProposed,
};
