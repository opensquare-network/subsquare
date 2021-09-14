const {
  getExternalFromStorageByHeight,
} = require("../../../../common/democracy/external");
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

  const [hash, voteThreshold] = await getExternalFromStorageByHeight(
    indexer.blockHeight + 1 // external will exist in storage after executed
  );
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
    indexer,
  };

  const { index: motionIndex, authors, proposer } = motion;
  const externalObj = {
    indexer,
    proposer,
    proposalHash,
    voteThreshold,
    motionIndex,
    authors,
    state,
    isFinal: false,
    timeline: [timelineItem],
  };

  await insertDemocracyExternal(externalObj);
  await insertDemocracyPostByExternal(proposalHash, indexer, authors[0]);
}

module.exports = {
  handleBusinessWhenMotionExecuted,
};
