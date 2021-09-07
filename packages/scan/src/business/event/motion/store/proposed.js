const { handleBusinessWhenMotionProposed } = require("./hooks/proposed");
const {
  Modules,
  TreasuryProposalMethods,
  DemocracyMethods,
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

function extractBusinessFields(proposal = {}) {
  const { section, method, args } = proposal;
  if (
    Modules.Treasury === section &&
    [
      TreasuryProposalMethods.approveProposal,
      TreasuryProposalMethods.rejectProposal,
    ].includes(method)
  ) {
    return {
      isTreasury: true,
      treasuryProposalIndex: args[0].value,
    };
  }

  if (Modules.Democracy) {
    const fields = {
      isDemocracy: true,
    };

    if (
      [
        DemocracyMethods.externalPropose,
        DemocracyMethods.externalProposeMajority,
        DemocracyMethods.externalProposeDefault,
      ].includes(method)
    ) {
      fields["proposalHash"] = args[0].value;
    }

    return fields;
  }

  return {};
}

async function handleProposed(registry, event, extrinsic, indexer) {
  const eventData = event.data.toJSON();
  const [proposer, motionIndex, hash, threshold] = eventData;

  const proposal = await getMotionProposalCall(hash, indexer);
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

  const obj = {
    indexer,
    hash,
    proposer,
    index: motionIndex,
    threshold,
    ...extractBusinessFields(proposal),
    proposal,
    voting,
    isFinal: false,
    state,
    timeline: [timelineItem],
  };

  await insertMotion(obj);
  await handleBusinessWhenMotionProposed(obj, indexer);
}

module.exports = {
  extractBusinessFields,
  handleProposed,
};
