const {
  isStateChangeBountyMotionCall,
} = require("../../../../common/call/utils");
const { updateBounty } = require("../../../../../mongo/service/onchain/bounty");
const { getBountyMeta } = require("../../../../common/bounty/meta");
const {
  updateTreasuryProposal,
} = require("../../../../../mongo/service/treasuryProposal");
const {
  TreasuryProposalEvents,
  BountyStatus,
} = require("../../../../common/constants");
const { getMotionCollection } = require("../../../../../mongo");
const {
  log: { logger },
} = require("@subsquare/scan-common");

async function handleBounty(bountyIndex, indexer) {
  const state = {
    indexer,
    // If a bounty proposal(close or approve) motion is not passed, we reset the treasury bounty state to `Proposed`
    state: BountyStatus.Proposed,
  };

  const meta = await getBountyMeta(bountyIndex, indexer);
  if (meta) {
    await updateBounty(bountyIndex, { meta, state });
  }
}

async function handleProposal(treasuryProposalIndex, indexer) {
  const state = {
    indexer,
    // If a treasury proposal motion is not passed, we reset the treasury proposal state to `Proposed`
    state: TreasuryProposalEvents.Proposed,
  };

  logger.info(
    `treasury proposal ${treasuryProposalIndex} motion not passed, proposal reset`,
    indexer
  );
  await updateTreasuryProposal(treasuryProposalIndex, { state });
}

async function handleBusinessWhenMotionDisApproved(motionHash, indexer) {
  const col = await getMotionCollection();
  const motion = await col.findOne({ hash: motionHash, isFinal: false });
  if (!motion) {
    return;
  }

  for (const { index } of motion.treasuryProposals || []) {
    await handleProposal(index, indexer);
  }

  for (const { index, method } of motion.treasuryBounties || []) {
    if (isStateChangeBountyMotionCall(method)) {
      await handleBounty(index, indexer);
    }
  }
}

module.exports = {
  handleBusinessWhenMotionDisApproved,
};
