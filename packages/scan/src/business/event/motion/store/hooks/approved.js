const {
  updateTreasuryProposal,
} = require("../../../../../mongo/service/treasuryProposal");
const {
  CouncilEvents,
  TreasuryProposalMethods,
} = require("../../../../common/constants");
const { getMotionCollection } = require("../../../../../mongo");
const { logger } = require("../../../../../logger");

async function handleProposal(proposalInfo, indexer) {
  const { index: treasuryProposalIndex, method } = proposalInfo;

  const isApproved = TreasuryProposalMethods.approveProposal === method;
  if (!isApproved) {
    return;
  }

  const state = {
    indexer,
    state: CouncilEvents.Approved,
  };

  logger.info(
    `treasury proposal ${treasuryProposalIndex} got approved`,
    indexer
  );
  await updateTreasuryProposal(treasuryProposalIndex, { state });
}

async function handleBusinessWhenMotionApproved(motionHash, indexer) {
  const col = await getMotionCollection();
  const motion = await col.findOne({ hash: motionHash, isFinal: false });
  if (!motion) {
    return;
  }

  for (const proposalInfo of motion.treasuryProposals || []) {
    await handleProposal(proposalInfo, indexer);
  }
}

module.exports = {
  handleBusinessWhenMotionApproved,
};
