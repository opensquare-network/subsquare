const {
  updateTreasuryProposal,
} = require("../../../../../mongo/service/treasuryProposal");
const {
  TreasuryProposalMethods,
  TreasuryProposalEvents,
} = require("../../../../common/constants");
const { getMotionCollection } = require("../../../../../mongo");

async function handleBusinessWhenMotionDisApproved(motionHash, indexer) {
  const col = await getMotionCollection();
  const motion = await col.findOne({ hash: motionHash });
  if (!motion) {
    return;
  }

  const { isTreasury, treasuryProposalIndex } = motion;
  if (!isTreasury) {
    return;
  }

  const { method } = motion.proposal || {};
  const isRejectProposal = TreasuryProposalMethods.rejectProposal === method;
  if (!isRejectProposal) {
    return;
  }

  const state = {
    indexer,
    // If a reject treasury proposal motion is not passed, we reset the treasury proposal state to `Proposed`
    state: TreasuryProposalEvents.Proposed,
  };

  await updateTreasuryProposal(treasuryProposalIndex, { state });
}

module.exports = {
  handleBusinessWhenMotionDisApproved,
};
