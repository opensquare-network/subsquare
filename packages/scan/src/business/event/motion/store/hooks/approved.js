const {
  updateTreasuryProposal,
} = require("../../../../../mongo/service/treasuryProposal");
const {
  CouncilEvents,
  TreasuryProposalMethods,
} = require("../../../../common/constants");
const { getMotionCollection } = require("../../../../../mongo");

async function handleBusinessWhenMotionApproved(motionHash, indexer) {
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
  const isApproved = TreasuryProposalMethods.approveProposal === method;
  if (!isApproved) {
    return;
  }

  const state = {
    indexer,
    state: CouncilEvents.Approved,
  };

  await updateTreasuryProposal(treasuryProposalIndex, { state });
}

module.exports = {
  handleBusinessWhenMotionApproved,
};
