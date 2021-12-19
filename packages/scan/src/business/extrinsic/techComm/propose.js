const {
  insertTechCommMotion,
} = require("../../../mongo/service/onchain/techCommMotion");
const {
  handleBusinessWhenTechCommMotionProposed,
} = require("../../event/techCommMotion/service/hooks/proposed");
const {
  extractBusinessFields,
} = require("../../event/techCommMotion/service/proposed");
const { normalizeCall } = require("../../common/motion/utils");
const {
  business: {
    consts: { Modules, TechnicalCommitteeMethods, TechnicalCommitteeEvents },
  },
} = require("@subsquare/scan-common");

function isTechCommProposeCall(call) {
  return (
    Modules.TechnicalCommittee === call.section &&
    TechnicalCommitteeMethods.propose === call.method
  );
}

async function handleTechCommPropose(
  call,
  signer,
  extrinsicIndexer,
  extrinsicEvents
) {
  if (!isTechCommProposeCall(call)) {
    return;
  }

  const threshold = call.args[0].toNumber();
  if (threshold >= 2) {
    return;
  }

  const proposedEvent = extrinsicEvents.find(
    ({ event }) =>
      Modules.TechnicalCommittee === event.section &&
      TechnicalCommitteeEvents.Proposed === event.method
  );
  if (proposedEvent) {
    // If there is proposed event, we just handle it in event business handling, not here.
    return;
  }

  const executedEvent = extrinsicEvents.find(
    ({ event }) =>
      Modules.TechnicalCommittee === event.section &&
      TechnicalCommitteeEvents.Executed === event.method
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

  await handleBusinessWhenTechCommMotionProposed(obj, extrinsicIndexer);
  await insertTechCommMotion(obj);
}

module.exports = {
  handleTechCommPropose,
};
