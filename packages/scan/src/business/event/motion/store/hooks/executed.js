const {
  insertDemocracyExternalPost,
} = require("../../../../../mongo/service/business/democracyExternal");
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
  const motion = await col.findOne({ hash: motionHash });
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
  // FIXME: We may reuse the post of the motion if external is proposed by council#motion
  await insertDemocracyExternalPost(proposalHash);
}

module.exports = {
  handleBusinessWhenMotionExecuted,
};
