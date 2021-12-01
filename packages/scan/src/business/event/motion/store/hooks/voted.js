const {
  TreasuryProposalMethods,
  MotionState,
} = require("../../../../common/constants");
const {
  updateTreasuryProposal,
} = require("../../../../../mongo/service/treasuryProposal");
const { getMotionCollection } = require("../../../../../mongo");
const { logger } = require("../../../../../logger");

async function updateProposalState(proposalInfo, motion, voting, indexer) {
  const { index: proposalIndex, method } = proposalInfo;
  const stateName =
    method === TreasuryProposalMethods.approveProposal
      ? MotionState.ApproveVoting
      : MotionState.RejectVoting;

  const state = {
    indexer,
    state: stateName,
    data: {
      motionState: motion.state,
      motionVoting: voting,
    },
  };

  logger.info("proposal state updated by motion voted", indexer);
  await updateTreasuryProposal(proposalIndex, { state });
}

async function handleBusinessWhenMotionVoted(motionHash, voting, indexer) {
  const col = await getMotionCollection();
  const motion = await col.findOne({ hash: motionHash });
  if (!motion) {
    logger.error(
      `can not find motion when handle motion voted business, hash: ${motionHash}`,
      indexer
    );
    return;
  }

  for (const proposalInfo of motion.treasuryProposals || []) {
    await updateProposalState(proposalInfo, motion, voting, indexer);
  }
}

module.exports = {
  handleBusinessWhenMotionVoted,
};
