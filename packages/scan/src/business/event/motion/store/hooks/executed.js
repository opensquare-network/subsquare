const { busLogger } = require("../../../../../logger");
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
  if (!isDemocracy || !proposalHash) {
    // no proposalHash means it's not a external proposal related motion, so just ignore it
    return;
  }

  const nextExternal = await getExternalFromStorageByHeight(
    indexer.blockHeight
  );
  if (!nextExternal || !Array.isArray(nextExternal)) {
    busLogger.error(
      `Can not get external at motion executed, indexer:`,
      indexer,
      "expected external proposal hash:",
      proposalHash
    );
  }

  const [hash, voteThreshold] = nextExternal;
  if (hash !== proposalHash) {
    throw new Error(`Not matched external hash, ${JSON.stringify(indexer)}`);
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
  busLogger.info("External created at", indexer.blockHeight, externalObj);
}

module.exports = {
  handleBusinessWhenMotionExecuted,
};
