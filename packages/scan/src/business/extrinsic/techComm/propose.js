const {
  insertTechCommMotionPost,
} = require("../../../mongo/service/business/techCommMotion");
const {
  extractTechCommMotionBusiness,
} = require("../../common/techComm/extractBusiness");
const {
  insertTechCommMotion,
} = require("../../../mongo/service/onchain/techCommMotion");
const {
  handleBusinessWhenTechCommMotionProposed,
} = require("../../event/techCommMotion/service/hooks/proposed");
const { normalizeCall } = require("../../common/motion/utils");
const {
  Modules,
  TechnicalCommitteeMethods,
  TechnicalCommitteeEvents,
} = require("../../common/constants");

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

  const { externalProposals } = await extractTechCommMotionBusiness(
    call.args[1],
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
    proposal,
    isFinal: false,
    timeline: [],
    externalProposals,
  };

  await handleBusinessWhenTechCommMotionProposed(obj, extrinsicIndexer);
  await insertTechCommMotion(obj);
  await insertTechCommMotionPost(extrinsicIndexer, motionHash, null, signer);
}

module.exports = {
  handleTechCommPropose,
};
