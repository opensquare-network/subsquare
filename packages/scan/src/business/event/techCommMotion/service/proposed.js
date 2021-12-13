const {
  insertTechCommMotionPost,
} = require("../../../../mongo/service/business/techCommMotion");
const {
  extractTechCommMotionBusiness,
} = require("../../../common/techComm/extractBusiness");
const { normalizeCall } = require("../../../common/motion/utils");
const {
  handleBusinessWhenTechCommMotionProposed,
} = require("./hooks/proposed");
const {
  insertTechCommMotion,
} = require("../../../../mongo/service/onchain/techCommMotion");
const {
  Modules,
  TimelineItemTypes,
  CouncilEvents,
  DemocracyMethods,
} = require("../../../common/constants");
const {
  getTechCommMotionVotingFromStorage,
} = require("../../../common/techComm/votingStorage");
const {
  getTechCommMotionProposal,
} = require("../../../common/techComm/proposalStorage");

function extractBusinessFields(proposal = {}) {
  const { section, method, args } = proposal;

  if (Modules.Democracy === section) {
    const fields = {
      isDemocracy: true,
    };

    if (
      [DemocracyMethods.fastTrack, DemocracyMethods.vetoExternal].includes(
        method
      )
    ) {
      fields["externalProposalHash"] = args[0].value;
    }

    return fields;
  }

  return {};
}

async function handleProposed(event, extrinsic, indexer, extrinsicEvents) {
  const eventData = event.data.toJSON();
  const [proposer, motionIndex, hash, threshold] = eventData;
  const authors = [...new Set([proposer, extrinsic.signer.toString()])];

  const rawProposal = await getTechCommMotionProposal(hash, indexer);
  const proposal = normalizeCall(rawProposal);
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

  const { externalProposals } = await extractTechCommMotionBusiness(
    rawProposal,
    proposer,
    indexer,
    extrinsicEvents
  );

  const obj = {
    indexer,
    hash,
    proposer,
    index: motionIndex,
    threshold,
    authors,
    ...extractBusinessFields(proposal),
    proposal,
    voting,
    isFinal: false,
    state,
    timeline: [timelineItem],
    externalProposals,
  };

  await handleBusinessWhenTechCommMotionProposed(obj, indexer);
  await insertTechCommMotion(obj);
  await insertTechCommMotionPost(indexer, hash, motionIndex, proposer);
}

module.exports = {
  handleProposed,
  extractBusinessFields,
};
