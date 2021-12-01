const { handleWrappedCall } = require("../../../../common/call/handle");
const {
  isTreasuryProposalMotionCall,
} = require("../../../../common/call/utils");
const {
  updateTreasuryProposal,
} = require("../../../../../mongo/service/treasuryProposal");
const {
  TreasuryProposalMethods,
  MotionState,
} = require("../../../../common/constants");
const { logger } = require("../../../../../logger");

async function handleProposalCall(motion, call, author, indexer) {
  const { section, method, args } = call;
  if (!isTreasuryProposalMotionCall(section, method)) {
    return;
  }

  const treasuryProposalIndex = args[0].toJSON();
  const motionInfo = {
    indexer,
    index: motion.index,
    hash: motion.hash,
    method,
    proposer: author,
  };

  const stateName =
    method === TreasuryProposalMethods.approveProposal
      ? MotionState.ApproveVoting
      : MotionState.RejectVoting;

  const state = {
    indexer,
    state: stateName,
    data: {
      motionState: motion.state,
      motionVoting: motion.voting,
    },
  };

  logger.info(
    `Detected motion for treasury proposal ${treasuryProposalIndex} ${method}`,
    motionInfo
  );
  await updateTreasuryProposal(
    treasuryProposalIndex,
    { state },
    null,
    motionInfo
  );
}

async function handleBusiness(call, author, indexer) {
  await handleProposalCall(this.motion, ...arguments);
}

async function handleBusinessWhenMotionProposed(
  motionDbObj = {},
  rawProposal,
  indexer,
  blockEvents
) {
  await handleWrappedCall(
    rawProposal,
    motionDbObj.proposer,
    indexer,
    blockEvents,
    handleBusiness.bind({ motion: motionDbObj })
  );
}

module.exports = {
  handleBusinessWhenMotionProposed,
};
