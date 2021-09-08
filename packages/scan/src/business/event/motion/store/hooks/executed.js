const {
  insertDemocracyPostByExternal,
} = require("../../../../../mongo/service/business/democracy");
const {
  insertDemocracyExternal,
} = require("../../../../../mongo/service/onchain/democracyExternal");
const {
  DemocracyExternalStates,
  TimelineItemTypes,
} = require("../../../../common/constants");
const {
  getExternalFromStorage,
} = require("../../../../common/democracy/external");
const { getMotionCollection } = require("../../../../../mongo");

async function handleBusinessWhenMotionExecuted(motionHash, indexer) {
  const col = await getMotionCollection();
  const motion = await col.findOne({ hash: motionHash, isFinal: false });
  if (!motion) {
    return;
  }

  const { isDemocracy, proposalHash } = motion;
  if (!isDemocracy) {
    return;
  }

  const [hash, voteThreshold] = await getExternalFromStorage(indexer);
  if (hash !== proposalHash) {
    throw new Error("Not matched external hash");
  }

  const state = {
    indexer,
    state: DemocracyExternalStates.Proposed,
    data: [hash, voteThreshold],
  };

  const {
    proposal: { method },
  } = motion;

  const timelineItem = {
    type: TimelineItemTypes.extrinsic,
    method: method,
    args: {
      proposalHash,
    },
  };

  const externalObj = {
    proposalHash,
    voteThreshold,
    motionHash,
    state,
    timeline: [timelineItem],
  };

  await insertDemocracyExternal(externalObj);
  await insertDemocracyPostByExternal(proposalHash);
}

module.exports = {
  handleBusinessWhenMotionExecuted,
};
