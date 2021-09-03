const {
  updateMotionByHash,
} = require("../../../../../mongo/service/onchain/motion");
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

  const { isTreasury } = motion;
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

  await updateMotionByHash(hash, { state });
}

module.exports = {
  handleBusinessWhenMotionApproved,
};
