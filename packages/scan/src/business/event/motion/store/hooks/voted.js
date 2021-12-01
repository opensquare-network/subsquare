const {
  isStateChangeBountyMotionCall,
} = require("../../../../common/call/utils");
const { updateBounty } = require("../../../../../mongo/service/onchain/bounty");
const {
  TreasuryProposalMethods,
  MotionState,
  BountyMethods,
} = require("../../../../common/constants");
const {
  updateTreasuryProposal,
} = require("../../../../../mongo/service/treasuryProposal");
const { getMotionCollection } = require("../../../../../mongo");
const { logger } = require("../../../../../logger");

function getState(name, motion, voting, indexer) {
  return {
    indexer,
    state: name,
    data: {
      motionState: motion.state,
      motionVoting: voting,
    },
  };
}

async function updateProposalState(proposalInfo, motion, voting, indexer) {
  const { index: proposalIndex, method } = proposalInfo;
  const stateName =
    method === TreasuryProposalMethods.approveProposal
      ? MotionState.ApproveVoting
      : MotionState.RejectVoting;

  const state = getState(stateName, motion, voting, indexer);

  logger.info("proposal state updated by motion voted", indexer);
  await updateTreasuryProposal(proposalIndex, { state });
}

async function updateBountyState(bountyInfo, motion, voting, indexer) {
  const { index: bountyIndex, method } = bountyInfo;
  if (!isStateChangeBountyMotionCall(method)) {
    return;
  }

  let stateName;
  if (BountyMethods.closeBounty === method) {
    stateName = "CloseVoting";
  } else if (BountyMethods.approveBounty === method) {
    stateName = "ApproveVoting";
  }

  if (!stateName) {
    return;
  }

  const state = getState(stateName, motion, voting, indexer);
  await updateBounty(bountyIndex, { state });
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

  for (const bountyInfo of motion.treasuryBounties || []) {
    await updateBountyState(bountyInfo, motion, voting, indexer);
  }
}

module.exports = {
  handleBusinessWhenMotionVoted,
};
