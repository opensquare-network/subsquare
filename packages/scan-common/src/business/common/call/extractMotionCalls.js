const {
  isBountyMotionCall,
  isDemocracyExternalCall,
  isTreasuryProposalMotionCall,
} = require("./utils");
const { handleWrappedCall } = require("./handle");

async function extractCouncilMotionBusiness(
  motionProposalCall,
  signer,
  indexer,
  events
) {
  const treasuryProposals = [];
  const treasuryBounties = [];
  const externalProposals = [];

  await handleWrappedCall(
    motionProposalCall,
    signer,
    indexer,
    events,
    (call) => {
      const { section, method, args } = call;
      if (isTreasuryProposalMotionCall(section, method)) {
        const treasuryProposalIndex = args[0].toJSON();
        treasuryProposals.push({
          index: treasuryProposalIndex,
          method,
        });
      } else if (isBountyMotionCall(section, method)) {
        const treasuryBountyIndex = args[0].toJSON();
        treasuryBounties.push({
          index: treasuryBountyIndex,
          method,
        });
      } else if (isDemocracyExternalCall(section, method)) {
        const externalProposalHash = args[0].toJSON();
        externalProposals.push({
          hash: externalProposalHash,
          method,
        });
      }
    }
  );

  return {
    treasuryProposals,
    treasuryBounties,
    externalProposals,
  };
}

module.exports = {
  extractCouncilMotionBusiness,
};
