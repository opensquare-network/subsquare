const { updateBounty } = require("../../../../../mongo/service/onchain/bounty");
const { getBountyMeta } = require("../../../../common/bounty/meta");
const {
  updateTreasuryProposal,
} = require("../../../../../mongo/service/treasuryProposal");
const {
  getExternalFromStorageByHeight,
} = require("../../../../common/democracy/external");
const {
  insertDemocracyPostByExternal,
} = require("../../../../../mongo/service/business/democracy");
const {
  insertDemocracyExternal,
} = require("../../../../../mongo/service/onchain/democracyExternal");
const { getMotionCollection } = require("../../../../../mongo");
const {
  log: { logger, busLogger },
  business: {
    consts: {
      DemocracyExternalStates,
      TimelineItemTypes,
      TreasuryProposalMethods,
      TreasuryProposalEvents,
      BountyMethods,
      BountyStatus,
    },
  },
} = require("@subsquare/scan-common");

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
  busLogger.info(`External ${hash} created at`, indexer.blockHeight);
}

module.exports = {
  handleBusinessWhenMotionExecuted,
};
