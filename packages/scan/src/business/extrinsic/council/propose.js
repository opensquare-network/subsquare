const {
  extractCouncilMotionBusiness,
} = require("../../common/call/extractMotionCalls");
const { insertMotionPost } = require("../../../mongo/service/business/motion");
const {
  handleBusinessWhenMotionProposed,
} = require("../../event/motion/store/hooks/proposed");
const { insertMotion } = require("../../../mongo/service/onchain/motion");
const { extractBusinessFields } = require("../../event/motion/store/proposed");
const { normalizeCall } = require("../../common/motion/utils");
const {
  Modules,
  CollectiveMethods,
  CouncilEvents,
  KaruraModules,
} = require("../../common/constants");
const { busLogger } = require("../../../logger");

function isCouncilProposeCall(call) {
  return (
    [KaruraModules.GeneralCouncil, Modules.Council].includes(call.section) &&
    CollectiveMethods.propose === call.method
  );
}

function hasProposedEvent(extrinsicEvents) {
  return extrinsicEvents.some(
    ({ event }) =>
      [KaruraModules.GeneralCouncil, Modules.Council].includes(event.section) &&
      CouncilEvents.Proposed === event.method
  );
}

async function handleCouncilPropose(
  call,
  signer,
  extrinsicIndexer,
  extrinsicEvents
) {
  if (!isCouncilProposeCall(call)) {
    return;
  }

  const threshold = call.args[0].toNumber();
  if (threshold >= 2) {
    return;
  }

  if (hasProposedEvent(extrinsicEvents)) {
    // If there is proposed event, we just handle it in event business handling, not here.
    return;
  }

  const executedEvent = extrinsicEvents.find(
    ({ event }) =>
      Modules.Council === event.section &&
      CouncilEvents.Executed === event.method
  );

  const [motionHash] = executedEvent.event.data.toJSON();

  const proposalCall = call.args[1];
  const proposal = normalizeCall(proposalCall);

  const { treasuryProposals, treasuryBounties } =
    await extractCouncilMotionBusiness(
      proposalCall,
      signer,
      extrinsicIndexer,
      extrinsicEvents
    );

  const obj = {
    indexer: extrinsicIndexer,
    hash: motionHash,
    proposer: signer,
    threshold,
    authors: [signer],
    ...extractBusinessFields(proposal),
    proposal,
    isFinal: false,
    timeline: [],
    treasuryProposals,
    treasuryBounties,
  };

  await insertMotion(obj);
  await insertMotionPost(extrinsicIndexer, motionHash, null, signer);
  await handleBusinessWhenMotionProposed(
    obj,
    proposalCall,
    extrinsicIndexer,
    extrinsicEvents
  );

  busLogger.info(`motion ${motionHash} created`, extrinsicIndexer);
}

module.exports = {
  handleCouncilPropose,
};
