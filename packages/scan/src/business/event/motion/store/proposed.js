const {
  extractMotionCalls,
} = require("../../../common/call/extractMotionCalls");
const { normalizeCall } = require("../../../common/motion/utils");
const { findRegistry } = require("../../../../chain/specs");
const { getMotionProposal } = require("../../../common/motion/proposalStorage");
const {
  insertMotionPost,
} = require("../../../../mongo/service/business/motion");
const { busLogger } = require("../../../../logger");
const { handleBusinessWhenMotionProposed } = require("./hooks/proposed");
const {
  Modules,
  DemocracyMethods,
  BountyMethods,
} = require("../../../common/constants");
const {
  getVotingFromStorage,
} = require("../../../common/motion/votingStorage");
const {
  TimelineItemTypes,
  CouncilEvents,
} = require("../../../common/constants");
const { insertMotion } = require("../../../../mongo/service/onchain/motion");
const { GenericCall } = require("@polkadot/types");

function extractBountyBusinessFields(proposal = {}, indexer) {
  const { section, method, args } = proposal;
  if (![Modules.Treasury, Modules.Bounties].includes(section)) {
    return;
  }

  if (
    ![
      BountyMethods.approveBounty,
      BountyMethods.proposeCurator,
      BountyMethods.unassignCurator,
      BountyMethods.closeBounty,
    ].includes(method)
  ) {
    return;
  }

  busLogger.info(
    `Bounty #${args[0].value} motion found at`,
    indexer.blockHeight,
    "method:",
    method
  );

  return {
    isBounty: true,
    bountyIndex: args[0].value,
  };
}

function extractBusinessFields(proposal = {}, indexer) {
  const maybeBountyFields = extractBountyBusinessFields(proposal, indexer);
  if (maybeBountyFields) {
    return maybeBountyFields;
  }

  const { section, method, args } = proposal;
  if (Modules.Democracy === section) {
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
    busLogger.info(
      "Democracy motion found at",
      indexer.blockHeight,
      "method:",
      method
    );

    return fields;
  }

  return {};
}

async function handleProposed(event, extrinsic, indexer, blockEvents) {
  const eventData = event.data.toJSON();
  const [proposer, motionIndex, hash, threshold] = eventData;

  const raw = await getMotionProposal(hash, indexer);
  const registry = await findRegistry(indexer);
  const call = new GenericCall(registry, raw.toHex());
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

  const { treasuryProposals, treasuryBounties } = await extractMotionCalls(
    call,
    proposer,
    indexer,
    blockEvents
  );

  const obj = {
    indexer,
    hash,
    authors,
    proposer,
    index: motionIndex,
    threshold,
    ...extractBusinessFields(proposal, indexer),
    proposal,
    voting,
    isFinal: false,
    state,
    timeline: [timelineItem],
    treasuryProposals,
    treasuryBounties,
  };

  await insertMotion(obj);
  await insertMotionPost(indexer, hash, motionIndex, proposer);
  await handleBusinessWhenMotionProposed(obj, call, indexer, blockEvents);
}

module.exports = {
  extractBusinessFields,
  handleProposed,
};
