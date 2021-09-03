const {
  updateTreasuryProposal,
} = require("../../../../../mongo/service/treasuryProposal");
const {
  TreasuryProposalMethods,
  MotionState,
} = require("../../../../common/constants");

async function handleBusinessWhenMotionProposed(motionDbObj = {}, indexer) {
  const { isTreasury, treasuryProposalIndex } = motionDbObj;
  if (!isTreasury) {
    return;
  }

  const { method } = motionDbObj.proposal;
  const stateName =
    method === TreasuryProposalMethods.approveProposal
      ? MotionState.ApproveVoting
      : MotionState.RejectVoting;

  const state = {
    indexer,
    state: stateName,
    data: {
      motionState: motionDbObj.state,
      motionVoting: motionDbObj.voting,
    },
  };

  await updateTreasuryProposal(treasuryProposalIndex, { state });
}

module.exports = {
  handleBusinessWhenMotionProposed,
};
