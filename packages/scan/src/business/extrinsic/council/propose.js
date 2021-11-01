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
} = require("../../common/constants");
const { busLogger } = require("../../../logger");

function isCouncilProposeCall(call) {
  return (
    Modules.Council === call.section &&
    CollectiveMethods.propose === call.method
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

  const proposedEvent = extrinsicEvents.find(
    ({ event }) =>
      Modules.Council === event.section &&
      CouncilEvents.Proposed === event.method
  );
  if (proposedEvent) {
    // If there is proposed event, we just handle it in event business handling, not here.
    return;
  }

  const executedEvent = extrinsicEvents.find(
    ({ event }) =>
      Modules.Council === event.section &&
      CouncilEvents.Executed === event.method
  );

  const [motionHash] = executedEvent.event.data.toJSON();
  const proposal = normalizeCall(call.args[1]);

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
  };

  await insertMotion(obj);
  await handleBusinessWhenMotionProposed(obj, extrinsicIndexer);

  busLogger.info(`motion ${motionHash} created`, extrinsicIndexer);
}

module.exports = {
  handleCouncilPropose,
};
