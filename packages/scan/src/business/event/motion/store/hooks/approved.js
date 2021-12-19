const {
  updateTreasuryProposal,
} = require("../../../../../mongo/service/treasuryProposal");
const {
  business: {
    consts: { CouncilEvents, TreasuryProposalMethods },
  },
} = require("@subsquare/scan-common");
const { getMotionCollection } = require("../../../../../mongo");
const {
  log: { logger },
} = require("@subsquare/scan-common");

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
