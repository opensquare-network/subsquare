const { isBountyMotionCall } = require("./utils");
const { isTreasuryProposalMotionCall } = require("./utils");
const { handleWrappedCall } = require("./handle");

async function extractMotionCalls(motionProposalCall, signer, indexer, events) {
  const treasuryProposals = [];
  const treasuryBounties = [];
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
      }
    }
  );

  return {
    treasuryProposals,
    treasuryBounties,
  };
}

module.exports = {
  extractMotionCalls,
};
