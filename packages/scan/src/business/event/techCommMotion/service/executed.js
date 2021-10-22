const { extractBusinessFields } = require("./proposed");
const {
  insertTechCommMotion,
} = require("../../../../mongo/service/onchain/techCommMotion");
const {
  handleBusinessWhenTechCommMotionProposed,
} = require("./hooks/proposed");
const { normalizeCall } = require("../../../common/motion/utils");
const { getTechCommMotionCollection } = require("../../../../mongo");
const {
  handleBusinessWhenTechCommMotionExecuted,
} = require("./hooks/executed");
const {
  updateTechCommMotionByHash,
} = require("../../../../mongo/service/onchain/techCommMotion");
const {
  TimelineItemTypes,
  TechnicalCommitteeEvents,
  TechnicalCommitteeMethods,
  Modules,
} = require("../../../common/constants");

async function insertMotionIfNotExist(hash, event, extrinsic, indexer) {
  const col = await getTechCommMotionCollection();
  const motion = await col.findOne({ hash, isFinal: false });
  if (motion) {
    return;
  }

  const { section, method, args } = extrinsic.method;
  if (
    Modules.TechnicalCommittee !== section ||
    TechnicalCommitteeMethods.propose !== method
  ) {
    return;
  }

  const threshold = args[0].toNumber();
  const proposal = normalizeCall(extrinsic.method.args[1]);

  const [motionHash] = event.data.toJSON();
  const signer = extrinsic.signer.toString();

  const obj = {
    indexer,
    hash: motionHash,
    proposer: signer,
    threshold,
    authors: [signer],
    ...extractBusinessFields(proposal),
    proposal,
    isFinal: false,
    timeline: [],
  };

  await handleBusinessWhenTechCommMotionProposed(obj, indexer);
  await insertTechCommMotion(obj);
}

async function handleExecuted(event, extrinsic, indexer, blockEvents) {
  const eventData = event.data.toJSON();
  const [hash, dispatchResult] = eventData;

  const state = {
    state: TechnicalCommitteeEvents.Executed,
    data: eventData,
    indexer,
  };

  const timelineItem = {
    type: TimelineItemTypes.event,
    method: TechnicalCommitteeEvents.Executed,
    args: {
      hash,
      dispatchResult,
    },
    indexer,
  };

  if (Object.keys(dispatchResult).includes("ok")) {
    await insertMotionIfNotExist(hash, event, extrinsic, indexer);
    await handleBusinessWhenTechCommMotionExecuted(hash, indexer, blockEvents);
  }

  const updates = { state, isFinal: true };
  await updateTechCommMotionByHash(hash, updates, timelineItem);
}

module.exports = {
  handleExecuted,
};
