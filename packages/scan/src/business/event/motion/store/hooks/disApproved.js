const {
  updateTreasuryProposal,
} = require("../../../../../mongo/service/treasuryProposal");
const { TreasuryProposalEvents } = require("../../../../common/constants");
const { getMotionCollection } = require("../../../../../mongo");
const { logger } = require("../../../../../logger");

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
}

module.exports = {
  handleBusinessWhenMotionDisApproved,
};
