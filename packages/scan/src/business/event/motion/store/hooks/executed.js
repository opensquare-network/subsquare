const { updateBounty } = require("../../../../../mongo/service/onchain/bounty");
const { getBountyMeta } = require("../../../../common/bounty/meta");
const {
  updateTreasuryProposal,
} = require("../../../../../mongo/service/treasuryProposal");
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
  TreasuryProposalMethods,
  TreasuryProposalEvents,
  BountyMethods,
  BountyStatus,
} = require("../../../../common/constants");
const { getMotionCollection } = require("../../../../../mongo");
const { logger } = require("../../../../../logger");

async function handleRejectTreasuryProposal(proposalInfo, indexer) {
  const { index: proposalIndex, method } = proposalInfo;

  if (method !== TreasuryProposalMethods.rejectProposal) {
    return;
  }

  const state = {
    state: TreasuryProposalEvents.Rejected,
    indexer,
  };

  logger.info(`treasury proposal ${proposalIndex} rejected`, indexer);
  await updateTreasuryProposal(proposalIndex, { state });
}

async function handleBounty(bountyInfo, indexer) {
  const { index: bountyIndex, method } = bountyInfo;

  let updates = {};

  const meta = await getBountyMeta(bountyIndex, indexer);
  if (meta) {
    updates.meta = meta;
  }

  if (BountyMethods.approveBounty === method) {
    updates.state = {
      indexer,
      state: BountyStatus.Approved,
    };
  }

  if (updates.meta || updates.state) {
    await updateBounty(bountyIndex, updates);
  }
}

async function handleExternalProposal(proposalHash, motion, indexer) {
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
    techCommMotions: [],
  };

  await insertDemocracyExternal(externalObj);
  await insertDemocracyPostByExternal(proposalHash, indexer, authors[0]);
  busLogger.info("External created at", indexer.blockHeight, externalObj);
}

async function handleBusinessWhenMotionExecuted(motionHash, indexer) {
  const col = await getMotionCollection();
  const motion = await col.findOne({ hash: motionHash, isFinal: false });
  if (!motion) {
    return;
  }

  for (const proposalInfo of motion.treasuryProposals || []) {
    await handleRejectTreasuryProposal(proposalInfo, indexer);
  }

  for (const bountyInfo of motion.treasuryBounties || []) {
    await handleBounty(bountyInfo, indexer);
  }

  if ((motion.externalProposals || []).length > 0) {
    await handleExternalProposal(externalInfo.hash, motion, indexer);
  }
}

module.exports = {
  handleBusinessWhenMotionExecuted,
};
