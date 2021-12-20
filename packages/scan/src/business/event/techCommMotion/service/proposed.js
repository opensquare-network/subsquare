const {
  insertTechCommMotionPost,
} = require("../../../../mongo/service/business/techCommMotion");
const {
  extractTechCommMotionBusiness,
} = require("../../../common/techComm/extractBusiness");
const {
  handleBusinessWhenTechCommMotionProposed,
} = require("./hooks/proposed");
const {
  insertTechCommMotion,
} = require("../../../../mongo/service/onchain/techCommMotion");
const {
  business: {
    consts: { CouncilEvents, TimelineItemTypes },
    normalizeCall,
  },
} = require("@subsquare/scan-common");
const {
  getTechCommMotionVotingFromStorage,
} = require("../../../common/techComm/votingStorage");
const {
  getTechCommMotionProposal,
} = require("../../../common/techComm/proposalStorage");

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
};
